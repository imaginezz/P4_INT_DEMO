#include <core.p4>
#include <v1model.p4>

#include "header.p4"
#include "parser.p4"

control egress(inout headers hdr, inout metadata meta, inout standard_metadata_t standard_metadata) {
    // @name("rewrite_mac")
    // action rewrite_mac(bit<48> smac) {
    //     hdr.ethernet.srcAddr = smac;
    // }
    @name("_drop")
    action _drop() {
        mark_to_drop();
    }
    @name("do_int") 
    action do_int(bit<6> intFlag) {
        hdr.udp.hdrChecksum = 16w0;       
        hdr.udp.len = hdr.udp.len+16w23;
        hdr.ipv4.totalLen=hdr.ipv4.totalLen+16w23;
        hdr.inthdr.setValid();
        hdr.inthdr.intFlag = intFlag;
        hdr.inthdr.ingress_port = standard_metadata.ingress_port;
        hdr.inthdr.egress_port = standard_metadata.egress_port;
        hdr.inthdr.ingress_global_timestamp = meta.intrinsic_metadata.ingress_global_timestamp;
        hdr.inthdr.enq_timestamp = meta.queueing_metadata.enq_timestamp;
        hdr.inthdr.enq_qdepth = meta.queueing_metadata.enq_qdepth;
        hdr.inthdr.deq_timedelta = meta.queueing_metadata.deq_timedelta;
        hdr.inthdr.deq_qdepth = meta.queueing_metadata.deq_qdepth;
    }
    @name("udp_int")
    table udp_int {
        actions = {
            _drop;
            do_int;
            NoAction;
        }
        key = {
            hdr.udp.dstPort: exact;
        }
        size = 1024;
        default_action = NoAction();
    }
    // @name("send_frame")
    // table send_frame {
    //     actions = {
    //         rewrite_mac;
    //         _drop;
    //         NoAction;
    //     }
    //     key = {
    //         standard_metadata.egress_port: exact;
    //     }
    //     size = 256;
    //     default_action = NoAction();
    // }
    apply {
    //     if (hdr.ipv4.isValid()) {
    //         // send_frame.apply();
            udp_int.apply();
    //     }
    }
}

control ingress(inout headers hdr, inout metadata meta, inout standard_metadata_t standard_metadata) {
    // @name("_drop")
    // action _drop() {
    //     mark_to_drop();
    // }
    // @name("set_nhop")
    // action set_nhop(bit<32> nhop_ipv4, bit<9> port) {
    //     meta.ingress_metadata.nhop_ipv4 = nhop_ipv4;
    //     standard_metadata.egress_spec = port;
    //     hdr.ipv4.ttl = hdr.ipv4.ttl + 8w255;
    // }
    // @name("set_dmac")
    // action set_dmac(bit<48> dmac) {
    //     hdr.ethernet.dstAddr = dmac;
    // }
    // @name("ipv4_lpm")
    // table ipv4_lpm {
    //     actions = {
    //         _drop;
    //         set_nhop;
    //         NoAction;
    //     }
    //     key = {
    //         hdr.ipv4.dstAddr: lpm;
    //     }
    //     size = 1024;
    //     default_action = NoAction();
    // }
    // @name("forward")
    // table forward {
    //     actions = {
    //         set_dmac;
    //         _drop;
    //         NoAction;
    //     }
    //     key = {
    //         meta.ingress_metadata.nhop_ipv4: exact;
    //     }
    //     size = 512;
    //     default_action = NoAction();
    // }

    @name("l2setmetadata")
    action l2setmetadata(bit<9> port) {
        standard_metadata.egress_spec = port;
        standard_metadata.egress_port = port;
    }
    @name("dol2arp")
    table dol2arp {
        actions = {
            l2setmetadata;
            NoAction;
        }
        key = {
            hdr.ethernet.dstAddr:exact;
        }
        size=512;
        default_action=NoAction();
    }
    @name("dol2int")
    table dol2int {
        actions = {
            l2setmetadata;
            NoAction;
        }
        key = {
            hdr.udp.dstPort:exact;
        }
        size=512;
        default_action=NoAction();
    }
    @name("dosocket")
    table dosocket {
        actions = {
            l2setmetadata;
            NoAction;
        }
        key = {
            hdr.udp.dstPort:exact;
        }
        size=512;
        default_action=NoAction();
    }
    apply {
        // if (hdr.ipv4.isValid()) {
            dol2arp.apply();
            dol2int.apply();
            dosocket.apply();
            // ipv4_lpm.apply();
            // forward.apply();
        // }
    }
}

V1Switch(ParserImpl(), verifyChecksum(), ingress(), egress(), computeChecksum(), DeparserImpl()) main;
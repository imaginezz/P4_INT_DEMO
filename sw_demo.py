#!/usr/bin/env python2

# Copyright 2013-present Barefoot Networks, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

from mininet.net import Mininet
from mininet.topo import Topo
from mininet.log import setLogLevel, info
from mininet.cli import CLI

from p4_mininet import P4Switch, P4Host

import argparse
from time import sleep

parser = argparse.ArgumentParser(description='Mininet demo')
parser.add_argument('--behavioral-exe', help='Path to behavioral executable',
                    type=str, action="store", required=True)
parser.add_argument('--json', help='Path to JSON config file',
                    type=str, action="store", required=True)

args = parser.parse_args()


class MakeSwitchTopo(Topo):

    def __init__(self, sw_path, json_path, **opts):
        Topo.__init__(self, **opts)

        switch1 = self.addSwitch('s1',
                                sw_path=sw_path,
                                json_path=json_path,
                                thrift_port=9090,
                                pcap_dump=False)
        switch2 = self.addSwitch('s2',
                                sw_path=sw_path,
                                json_path=json_path,
                                thrift_port=9091,
                                pcap_dump=False)
        switch3 = self.addSwitch('s3',
                                sw_path=sw_path,
                                json_path=json_path,
                                thrift_port=9092,
                                pcap_dump=False)
        switch4 = self.addSwitch('s4',
                                sw_path=sw_path,
                                json_path=json_path,
                                thrift_port=9093,
                                pcap_dump=False)

        host1 = self.addHost('h1',
                            ip="10.0.0.2/24",
                            mac='00:01:00:00:00:00')
        host2 = self.addHost('h2',
                            ip="10.0.0.3/24",
                            mac='00:01:00:00:00:01')
        self.addLink(host1, switch1)
        self.addLink(switch1,switch2)
        self.addLink(switch1,switch3)
        self.addLink(switch2,switch4)
        self.addLink(switch3,switch4)
        self.addLink(host2, switch4)


def main():

    topo = MakeSwitchTopo(args.behavioral_exe, args.json)
    net = Mininet(topo=topo,
                  host=P4Host,
                  switch=P4Switch,
                  controller=None)
    net.start()

    h1=net.get('h1')
    # h1.setARP('10.0.0.1','00:aa:bb:00:00:02')
    h1.setDefaultRoute('dev eth0')
    h2=net.get('h2')
    # h2.setARP('10.0.0.1','00:aa:cc:00:00:01')
    h2.setDefaultRoute('dev eth0')

    h1=net.get('h1')
    h1.describe()
    h2=net.get('h2')
    h2.describe()

    sleep(1)

    print "Ready !"

    CLI(net)
    net.stop()


if __name__ == '__main__':
    setLogLevel('debug')     #debug,info
    main()

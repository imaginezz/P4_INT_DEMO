<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IntModel;

class SiteController extends Controller{
    
    public function getPerTimeData(Request $request){
        if($request->get('isnew')==='true'){
            $request->session()->put('lastestId',0);
            $lastestId=0;
        }else{
            $lastestId=$request->session()->get('lastestId',0);
        }
        $intData=IntModel::where('id','>',$lastestId)->get();
        if(count($intData)!==0){
            $request->session()->put('lastestId',$intData[count($intData)-1]['id']);
        }
        $convertedData=$this->dealIntData($intData);
        return response()->json($convertedData);
    }
    
    private function dealIntData($intData){
        $convertedData=[];
        foreach($intData as $data){
            $tempData=[];
            $tempData['timestamp']=date('Y-m-d H:i:s',$data['timestamp']);
            $tempData['packet_id']=$data['packet_id'];
            $tempData['port']=$data['port'];
            $tempData['id']=$data['id'];
            $tempData['intFlag']=bindec($data['intFlag']);
            $tempData['ingress_port']=bindec($data['ingress_port']);
            $tempData['egress_port']=bindec($data['egress_port']);
            $tempData['ingress_global_timestamp']=bindec($data['ingress_global_timestamp']);
            $tempData['enq_timestamp']=bindec($data['enq_timestamp']);
            $tempData['enq_qdepth']=bindec($data['enq_qdepth']);
            $tempData['deq_timedelta']=bindec($data['deq_timedelta']);
            $tempData['deq_qdepth']=bindec($data['deq_qdepth']);
            $tempData['timedelta']=$tempData['enq_timestamp']-$tempData['ingress_global_timestamp'];
            array_push($convertedData,$tempData);
        }
        return $convertedData;
    }

    public function getLinkStatus(Request $request){
        if($request->get('isnew')==='true'){
            $request->session()->put('lastestKey',0);
            $lastestKey=0;
        }else{
            $lastestKey=$request->session()->get('lastestKey',0);
        }
        $intData=IntModel::where('id','>',$lastestKey)->get();
        if(count($intData)!=0){
            $request->session()->put('lastestKey',$intData[count($intData)-1]['id']);
        }
        $intFlagCount=$this->dealIntFlag($intData);
        return response()->json($intFlagCount);
    }

    private function dealIntFlag($intData){
        $intFlagCount=[
            1=>0,
            2=>0,
            3=>0,
            4=>0,
        ];
        foreach($intData as $data){
            $intFlag=bindec($data['intFlag']);
            $intFlagCount[$intFlag]++;
        }
        return $intFlagCount;
    }
}
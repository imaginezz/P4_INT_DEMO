<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\IntModel;

class loadBalance extends Command
{
    /**
    * The name and signature of the console command.
    *
    * @var string
    */
    protected $signature = 'loadBalance';
    
    /**
    * The console command description.
    *
    * @var string
    */
    protected $description = 'do loadbalance';
    
    /**
    * Create a new command instance.
    *
    * @return void
    */
    public function __construct()
    {
        parent::__construct();
    }
    
    private $qdepthData;
    private $timeDeltaData;
    private $meanQdepthData;
    private $meanTimeDeltaData;
    private $initData=[
    's1'=>[],
    's2'=>[],
    's3'=>[],
    's4'=>[],
    ];
    private $initDataMean=[
    's1'=>0,
    's2'=>0,
    's3'=>0,
    's4'=>0,
    ];
    
    /**
    * Execute the console command.
    *
    * @return mixed
    */
    public function handle()
    {
        $this->clearIntData();
        $maxId=IntModel::max('id');
        $index=0;
        while(True){
            $this->info('index: '.++$index);
            $nowId=IntModel::max('id');
            // $intData=IntModel::where('id','>',$maxId)->where('id','<',$nowId);
            $intData=IntModel::where('id','>',10000)->where('id','<',10248)->get();
            // var_dump(count($intData));
            $this->dealIntData($intData);
            // var_dump($this->qdepthData);
            // var_dump($this->timeDeltaData);
            // var_dump($this->meanQdepthData);
            // var_dump($this->meanTimeDeltaData);
            $this->doLoadbalance();
            sleep(5);
            $this->clearIntData();
        }
    }
    
    private function doLoadbalance(){
        $s2=$this->meanTimeDeltaData['s2'];
        $s3=$this->meanTimeDeltaData['s3'];
        if($s2>$s3){
            $bigFlow='s2';
            $tinyFlow='s3';
        }else{
            $bigFlow='s3';
            $tinyFlow='s2';
        }
        $this->doFlowTable($bigFlow,$tinyFlow);
    }
    
    private function doFlowTable($bigFlow,$tinyFlow){
        $this->info('bigFlow: '.$bigFlow);
        $this->info('tinyFlow: '.$tinyFlow);
        $table=[
        'table_delete dosocket 2',
        'table_add dosocket l2setmetadata 3335 => 2',
        ];
        $cli='../runtime_CLI --thrift-port 9090';
        $handle=popen($cli,'w');
        $res=fwrite($handle,$table[0]);
        $handle=popen($cli,'w');
        $res=fwrite($handle,$table[1]);
        var_dump($res);
        pclose($handle);
    }
    
    private function dealIntData($intData){
        foreach($intData as $data){
            $intFlag=bindec($data['intFlag']);
            $enq_qdepth=bindec($data['enq_qdepth']);
            $deq_timedelta=bindec($data['deq_timedelta']);
            array_push($this->qdepthData['s'.$intFlag],$enq_qdepth);
            array_push($this->timeDeltaData['s'.$intFlag],$deq_timedelta);
        }
       foreach($this->qdepthData as $k=>$v){
            if(count($v)!=0){
                // echo $k."\n";
                // var_dump(array_sum($v));
                // echo "\n";
                // var_dump(count($v));
                // echo "\n";
                // var_dump(array_sum($v)/count($v));
                $meanQdepthData[$k]=array_sum($v)/count($v);
            }
        }
        foreach($this->timeDeltaData as $k=>$v){
            if(count($v)!=0){
                // echo $k."\n";
                // var_dump(array_sum($v));
                // echo "\n";
                // var_dump(count($v));
                // echo "\n";
                // var_dump(array_sum($v)/count($v));
                $meanTimeDeltaData[$k]=array_sum($v)/count($v);
            }
        }
    }
    
    private function clearIntData(){
        $this->qdepthData=$this->initData;
        $this->timeDeltaData=$this->initData;
        $this->meanQdepthData=$this->initDataMean;
        $this->meanTimeDeltaData=$this->initDataMean;
    }
}
<?php

header('Content-Type: application/json');
$dir = '.././json/ai';

if ( isset($_GET["MUID"]) ){
    
        //$MUID = 'freightgraffiti_1_hashtagTop_9_5d8799fe';
        $MUID = $_GET["MUID"];
        //echo $_GET["MUID"];

        $jsonFiles = array();
        foreach (glob("$dir/*") as $file) {
        		//echo $file;
            if (strpos($file, $MUID) !== false) {
            $file= str_replace(".././json/ai/", "", $file);
            array_push($jsonFiles, $file);
            }
        }
        if (count($jsonFiles) === 0) {
            //echo "Nuevos archivos";
            header("Location: ./json_hashtag_ai.php?MUID=".$MUID); 
            die();
        } else {
            //echo "Se acabo";
            echo json_encode($jsonFiles);
            die();
        }
    
}else{
   echo "No MUID";
   die(); 
} 
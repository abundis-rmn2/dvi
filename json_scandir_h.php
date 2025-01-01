<?php

header('Content-Type: application/json');
$dir = 'json';

if ( isset($_GET["MUID"]) ){
    
        //$MUID = 'miss_lizzy_dizzy_1_user_24e4b546';
        $MUID = $_GET["MUID"];
        //echo $_GET["MUID"];

        $jsonFiles = array();
        foreach (glob("$dir/*") as $file) {
            if (strpos($file, $MUID) !== false) {
            $file= str_replace("json/", "", $file);
            array_push($jsonFiles, $file);
            }
        }
        if (count($jsonFiles) === 0) {
            //echo "Se acsd";
            header("Location: ./json_hashtag.php?MUID=".$MUID); 
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
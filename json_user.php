<?php 
error_reporting(0);
header('Content-Type: application/json');
include("db.php");
    function json_format($conn, $MUID){
        $sql = "SELECT * FROM data_users WHERE MUID = '$MUID' LIMIT 999;";
        $data = [];
        $data['nodes'] =  array();
        $data['edges'] =  array();
    if(!$result = mysqli_query($conn, $sql)) die();
        while($row = mysqli_fetch_assoc($result)) {
            //print_r($row);
            array_push($data['nodes'], array('id'=> $row['username'],
                                            'label'=> $row['username']));
            
            $following = json_decode($row['following'], true);
            foreach ($following as $foll) {
               array_push($data['edges'], array('source'=> $row['username'],
                                       'target'=> $foll));   
                        }
            }
        return $data;
    }

    function json_format_sliced($conn, $MUID, $iteration_no){
        $it_start = ($iteration_no * 1000);
        $it_end = ($iteration_no * 1000) + 999;
        //echo "json_format_sliced - before sql: ".$MUID;
        $sql = "SELECT * FROM data_users WHERE MUID = '$MUID' LIMIT $it_start, $it_end;";
        //echo $sql;
        //echo mysqli_num_rows($sql);
        $data = [];
        $data['nodes'] =  array();
        $data['edges'] =  array();
    if(!$result = mysqli_query($conn, $sql)) die();
        while($row = mysqli_fetch_assoc($result)) {
            //echo $row['username']." ";
            array_push($data['nodes'], array('id'=> $row['username'],
                                            'label'=> $row['username']));
            
            $following = json_decode($row['following'], true);
            foreach ($following as $foll) {
               array_push($data['edges'], array('source'=> $row['username'],
                                       'target'=> $foll));   
                        }
            }
        return $data; 
    }

    function sliceSQLFetch($totalRows, $iteration_no, $MUID, $conn){
       if(isset($_GET["it_no"])) {
        $i = $_GET["it_no"];
       } else {
        $i= 0;
            }
        $iterations_needed = ceil($totalRows / 999);       
        //echo "sliceSQLFetch: ".$MUID;
        //echo "total ".$totalRows;
        //echo "it_ne: ".$iterations_needed;
        //echo "it_no: ".$i;
        $json_string = json_encode( json_format_sliced($conn, $MUID, $i) );
        //echo $json_string;
        $file = './json/'. $MUID .'_'.$i++.'.json';
        file_put_contents($file, $json_string);
        //file_put_contents($file, "pr");
        //echo "vive";
        //$iterations_needed = $iterations_needed - 1;
        //echo $iterations_needed;
        if ($iterations_needed > $i){
            //echo "menos";
            //echo $iterations_needed;
            $actual = 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'/?MUID='.$MUID.'&it_no='.$i;
            //echo $actual;
            header("Location: $actual");
            die();
        } else {
            $dir = 'json';
            $jsonFiles = array();
            foreach (glob("$dir/*") as $file) {
                if (strpos($file, $MUID) !== false) {
                $file= str_replace("json/", "", $file);
                array_push($jsonFiles, $file);
                }
            }
            echo json_encode($jsonFiles);
            die();
        }
    }


//generamos la consulta
if ( isset($_GET["MUID"]) ){
    
$MUID = $_GET["MUID"]; 
$sqlCount = "SELECT id FROM data_users WHERE MUID = '$MUID';";
mysqli_set_charset($conn, "utf8"); //formato de datos utf8
if(!$rowCount = mysqli_query($conn, $sqlCount)) die();
$totalRows = mysqli_num_rows($rowCount);
//echo $totalRows;
    if($totalRows > 999){
            //echo "after 999 ".$MUID;
            $iteration_no = 0;
            sliceSQLFetch($totalRows, $iteration_no, $MUID, $conn);
    } else {
            $json_string = json_encode(json_format($conn, $MUID));
            //echo $json_string;
            $file = './json/'. $MUID .'_0.json';
            file_put_contents($file, $json_string);
            header("Location: ./json_scandir.php?MUID=".$MUID);
        }
    
//desconectamos la base de datos
$close = mysqli_close($conn) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");

} else {
    echo "Falta MUID";
}
 
?>
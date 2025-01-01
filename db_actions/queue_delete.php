<?
include("../db.php");
//echo $_POST['id'];
if($_POST['id']){
  $queueId = $_POST['id'];
  //SELECT * FROM queue WHERE MUID='$MUID'
  $del = "DELETE FROM queue WHERE id = '$queueId'";
  //$result_queue = mysqli_query($conn, $query_queue);
  $result = mysqli_query($conn, $del);
  if($result)  {
    echo "deleted";
    }
}

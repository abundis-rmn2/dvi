<?php

include("db.php");

if(isset($_GET['id'])) {
  $id = $_GET['id'];
  $MUID = $_GET['MUID'];

  $query = "DELETE FROM tasks WHERE id = $id";
  $result = mysqli_query($conn, $query);
  if(!$result) {
    die("Query Failed: ID");
  }

  $queryQue = "DELETE FROM queue WHERE MUID = '$MUID'";
  $resultM = mysqli_query($conn, $queryQue);
  if(!$resultM) {
    die("Query Failed: $MUID");
  }

  $_SESSION['message'] = 'Task Removed Successfully';
  $_SESSION['message_type'] = 'danger';
  header('Location: index.php');
}

?>

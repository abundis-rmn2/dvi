<?php

include('db.php');

$random_hex = bin2hex(random_bytes(4));
echo serialize($random_hex);

if (isset($_POST['save_task'])) {
  $MUID = $_POST['muid'];
  $seednode = $_POST['seednode'];
  $iteratitions = $_POST['iterations'];
  $miningtype = $_POST['miningtype'];
  $hashtagmediaamount = $_POST['hashtagmediaamount'];

  $MUID = $MUID."_".$random_hex;

  $queryTasks = "INSERT INTO tasks(MUID, seed_node, mining_depth, mining_type, hashtag_media_amount) VALUES ('$MUID', '$seednode', '$iteratitions', '$miningtype', '$hashtagmediaamount')";
  $result = mysqli_query($conn, $queryTasks);
  if(!$result) {
    die("Insert into tasks failed.");
  }

  $queryQueue = "INSERT INTO queue(MUID, seed_node, mining_depth, mining_type, hashtag_media_amount, status) VALUES ('$MUID', '$seednode', '$iteratitions', '$miningtype', '$hashtagmediaamount', 'waiting')";
  $result = mysqli_query($conn,$queryQueue);
  if(!$result) {
    die("Insert into queue failed.");
  }

  $_SESSION['message'] = 'Task Saved Successfully';
  $_SESSION['message_type'] = 'success';
  header('Location: index.php');

}

?>

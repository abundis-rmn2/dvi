<?php

include('db.php');

$random_hex = bin2hex(random_bytes(4));
echo serialize($random_hex);

if (isset($_POST['save_task'])) {
    $MUID = mysqli_real_escape_string($conn, $_POST['muid']);
    $seednode = mysqli_real_escape_string($conn, $_POST['seednode']);
    $iterations = intval($_POST['iterations']);
    $miningtype = mysqli_real_escape_string($conn, $_POST['miningtype']);
    $hashtagmediaamount = intval($_POST['hashtagmediaamount']);

    $MUID = $MUID . "_" . $random_hex;

    $queryTasks = "INSERT INTO tasks(MUID, seed_node, mining_depth, mining_type, hashtag_media_amount) VALUES (?, ?, ?, ?, ?)";
    $stmtTasks = mysqli_prepare($conn, $queryTasks);
    mysqli_stmt_bind_param($stmtTasks, "ssisi", $MUID, $seednode, $iterations, $miningtype, $hashtagmediaamount);
    $resultTasks = mysqli_stmt_execute($stmtTasks);

    if (!$resultTasks) {
        die("Insert into tasks failed: " . mysqli_error($conn));
    }

    $queryQueue = "INSERT INTO queue(MUID, seed_node, mining_depth, mining_type, hashtag_media_amount, status) VALUES (?, ?, ?, ?, ?, 'waiting')";
    $stmtQueue = mysqli_prepare($conn, $queryQueue);
    mysqli_stmt_bind_param($stmtQueue, "ssisi", $MUID, $seednode, $iterations, $miningtype, $hashtagmediaamount);
    $resultQueue = mysqli_stmt_execute($stmtQueue);

    if (!$resultQueue) {
        die("Insert into queue failed: " . mysqli_error($conn));
    }

    $_SESSION['message'] = 'Task Saved Successfully';
    $_SESSION['message_type'] = 'success';
    header('Location: index.php');
    exit;
}

?>

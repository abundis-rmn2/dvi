<?php

include("db.php");

if (isset($_GET['id']) && isset($_GET['MUID'])) {
    $id = intval($_GET['id']);
    $MUID = mysqli_real_escape_string($conn, $_GET['MUID']);

    $query = "DELETE FROM tasks WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id);
    $result = mysqli_stmt_execute($stmt);

    if (!$result) {
        die("Query Failed: ID " . mysqli_error($conn));
    }

    $queryQue = "DELETE FROM queue WHERE MUID = ?";
    $stmtQue = mysqli_prepare($conn, $queryQue);
    mysqli_stmt_bind_param($stmtQue, "s", $MUID);
    $resultM = mysqli_stmt_execute($stmtQue);

    if (!$resultM) {
        die("Query Failed: MUID " . mysqli_error($conn));
    }

    $_SESSION['message'] = 'Task Removed Successfully';
    $_SESSION['message_type'] = 'danger';
    header('Location: index.php');
    exit;
}

?>

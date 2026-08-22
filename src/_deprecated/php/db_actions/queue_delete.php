<?php
include("../db.php");
if (isset($_POST['id'])) {
    $queueId = intval($_POST['id']);
    $del = "DELETE FROM queue WHERE id = ?";
    $stmt = mysqli_prepare($conn, $del);
    mysqli_stmt_bind_param($stmt, "i", $queueId);
    $result = mysqli_stmt_execute($stmt);
    if ($result) {
        echo "deleted";
    }
}
?>

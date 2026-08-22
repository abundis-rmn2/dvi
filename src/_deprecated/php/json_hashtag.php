<?php
error_reporting(0);
header('Content-Type: application/json');
include("db.php");

function json_format($conn, $MUID)
{
    // Dar de alta nodos hashtags 
    $sql = "SELECT * FROM data_recent_hashtags WHERE MUID = ? LIMIT 999";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $MUID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $data = [];
    $data['nodes'] = array();
    $data['edges'] = array();

    while ($row = mysqli_fetch_assoc($result)) {
        array_push($data['nodes'], array(
            'id' => $row['hashtag'],
            'label' => $row['hashtag'],
            'type' => 'hashtag'
        ));
    }

    $sqlPosts = "SELECT * FROM data_media WHERE MUID = ?";
    $stmtPosts = mysqli_prepare($conn, $sqlPosts);
    mysqli_stmt_bind_param($stmtPosts, "s", $MUID);
    mysqli_stmt_execute($stmtPosts);
    $resultPosts = mysqli_stmt_get_result($stmtPosts);

    while ($post = mysqli_fetch_assoc($resultPosts)) {
        array_push($data['nodes'], array(
            'id' => $post['m_id'],
            'label' => $post['user_id'] . "+" . $post['m_id'],
            'type' => 'post'
        ));
        array_push($data['nodes'], array(
            'id' => $post['user_id'],
            'label' => $post['user_id'],
            'type' => 'user'
        ));
        array_push($data['edges'], array(
            'source' => $post['user_id'],
            'target' => $post['m_id']
        ));

        $hashtags = json_decode($post['hashtags_used'], true);
        if (is_array($hashtags)) {
            foreach ($hashtags as $hash) {
                array_push($data['edges'], array(
                    'source' => $post['m_id'],
                    'target' => $hash
                ));
            }
        }
    }

    return $data;
}

function json_format_sliced($conn, $MUID, $iteration_no)
{
    // Implementation seems intended to be same as json_format but with potential future scaling
    return json_format($conn, $MUID);
}

function sliceSQLFetch($totalRows, $iteration_no, $MUID, $conn)
{
    if (isset($_GET["it_no"])) {
        $i = intval($_GET["it_no"]);
    } else {
        $i = 0;
    }
    $iterations_needed = ceil($totalRows / 999);
    $json_string = json_encode(json_format_sliced($conn, $MUID, $i));
    $file = './json/' . preg_replace('/[^a-zA-Z0-9_\-]/', '', $MUID) . '_' . $i++ . '.json';
    file_put_contents($file, $json_string);

    if ($iterations_needed > $i) {
        $actual = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . '/?MUID=' . urlencode($MUID) . '&it_no=' . $i;
        header("Location: $actual");
        exit;
    } else {
        $dir = 'json';
        $jsonFiles = array();
        $safeMUID = preg_replace('/[^a-zA-Z0-9_\-]/', '', $MUID);
        foreach (glob("$dir/*") as $file) {
            if (strpos($file, $safeMUID) !== false) {
                $file = str_replace("json/", "", $file);
                array_push($jsonFiles, $file);
            }
        }
        echo json_encode($jsonFiles);
        exit;
    }
}

//generamos la consulta
if (isset($_GET["MUID"])) {
    $MUID = $_GET["MUID"];
    $sqlCount = "SELECT id FROM data_recent_hashtags WHERE MUID = ?";
    mysqli_set_charset($conn, "utf8");
    $stmtCount = mysqli_prepare($conn, $sqlCount);
    mysqli_stmt_bind_param($stmtCount, "s", $MUID);
    mysqli_stmt_execute($stmtCount);
    $resultCount = mysqli_stmt_get_result($stmtCount);
    $totalRows = mysqli_num_rows($resultCount);

    if ($totalRows > 999) {
        $iteration_no = 0;
        sliceSQLFetch($totalRows, $iteration_no, $MUID, $conn);
    } else {
        $json_string = json_encode(json_format($conn, $MUID));
        $file = './json/' . preg_replace('/[^a-zA-Z0-9_\-]/', '', $MUID) . '_0.json';
        file_put_contents($file, $json_string);
        header("Location: ./json_scandir.php?MUID=" . urlencode($MUID));
        exit;
    }

    mysqli_close($conn);
} else {
    echo json_encode(["error" => "Falta MUID"]);
}
?>
 
?>
<?php
error_reporting(0);
header('Content-Type: application/json');
include("db.php");

$node = isset($_GET['node']) ? $_GET['node'] : '';
$nodeType = isset($_GET['nodeType']) ? $_GET['nodeType'] : '';
$MUID = isset($_GET['MUID']) ? $_GET['MUID'] : '';

function hyphenize($string) {
    if ($string === null) return '';
    $utf8 = array(
        '/[áàâãªä]/u'   =>   'a',
        '/[ÁÀÂÃÄ]/u'    =>   'A',
        '/[ÍÌÎÏ]/u'     =>   'I',
        '/[íìîï]/u'     =>   'i',
        '/[éèêë]/u'     =>   'e',
        '/[ÉÈÊË]/u'     =>   'E',
        '/[óòôõºö]/u'   =>   'o',
        '/[ÓÒÔÕÖ]/u'    =>   'O',
        '/[úùûü]/u'     =>   'u',
        '/[ÚÙÛÜ]/u'     =>   'U',
        '/ç/'           =>   'c',
        '/Ç/'           =>   'C',
        '/ñ/'           =>   'n',
        '/Ñ/'           =>   'N',
        '/–/'           =>   '-',
        '/[’‘‹›‚]/u'    =>   ' ',
        '/[“”«»„]/u'    =>   ' ',
        '/ /'           =>   ' ',
    );
    return preg_replace(array_keys($utf8), array_values($utf8), $string);
}

if (!empty($node) && !empty($nodeType)) {
    if ($nodeType == "hashtag" || $nodeType == "ai_text_hashtag") {
        $array = [];
        $array['hashtag_info']['MUID'] = $MUID;
        $array['hashtag_info']['node'] = $node;
        $array['hashtag_info']['no_publications'] = "Not mined";
        $array['hashtag_info']['mined_at'] = "Not mined"; 

        $query_hashtag = "SELECT * FROM data_recent_hashtags WHERE hashtag = ? AND MUID = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $query_hashtag);
        mysqli_stmt_bind_param($stmt, "ss", $node, $MUID);
        mysqli_stmt_execute($stmt);
        $result_hashtag = mysqli_stmt_get_result($stmt);
        if ($row_hashtag = mysqli_fetch_assoc($result_hashtag)) {
            $array['hashtag_info']['no_publications'] = $row_hashtag['no_publications'];
            $array['hashtag_info']['mined_at'] = $row_hashtag['mined_at'];
        }

        $query_users = "SELECT * FROM data_media WHERE MUID = ? AND caption_text LIKE ?";
        $likeNode = "%$node%";
        $stmt_users = mysqli_prepare($conn, $query_users);
        mysqli_stmt_bind_param($stmt_users, "ss", $MUID, $likeNode);
        mysqli_stmt_execute($stmt_users);
        $result_users = mysqli_stmt_get_result($stmt_users);
        $i_post = 0;
        while ($row_users = mysqli_fetch_assoc($result_users)) {
            $i_post++;
            $array['post'][$i_post] = $row_users;
            $array['post'][$i_post]['caption_text'] = hyphenize($row_users['caption_text']);
        }
        echo json_encode($array);
    }
    elseif ($nodeType == "post") {
        $array = [];
        $query_users = "SELECT * FROM data_media WHERE m_id = ?";
        $stmt = mysqli_prepare($conn, $query_users);
        mysqli_stmt_bind_param($stmt, "s", $node);
        mysqli_stmt_execute($stmt);
        $result_users = mysqli_stmt_get_result($stmt);
        $i_post = 0;
        while ($row_users = mysqli_fetch_assoc($result_users)) {
            $i_post++;
            $array['post'][$i_post] = $row_users;
            $array['post'][$i_post]['caption_text'] = hyphenize($row_users['caption_text']);
        }
        echo json_encode($array);
    }
    else {
        echo json_encode(["info" => $nodeType]);
    }
} else {
    echo json_encode(["error" => "Missing parameters"]);
}
?>

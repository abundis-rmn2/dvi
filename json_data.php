<?php
error_reporting(-1);
header('Content-Type: application/json');
include("db.php");
$node=$_GET['node'];
$nodeType=$_GET['nodeType'];
$MUID=$_GET['MUID'];

function hyphenize($string) {
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
        '/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
        '/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
        '/[“”«»„]/u'    =>   ' ', // Double quote
        '/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160)
    );
    return preg_replace(array_keys($utf8), array_values($utf8), $string);
}


if ( isset($_GET["node"]) && isset($_GET["nodeType"]) ){
    if ($_GET["nodeType"] == "hashtag" || $_GET["nodeType"] == "ai_text_hashtag") {
        $array;
        $array['hashtag_info']['MUID'] = $MUID;
        $array['hashtag_info']['node'] = $node;
        $array['hashtag_info']['no_publications'] = "Not mined";
        $array['hashtag_info']['mined_at'] = "Not mined"; 

        $query_hashtag = "SELECT * FROM data_recent_hashtags WHERE hashtag='$node' and MUID='$MUID' LIMIT 1";
        $result_hashtag = mysqli_query($conn, $query_hashtag);
        while($row_hashtag = mysqli_fetch_assoc($result_hashtag)){
            $array['hashtag_info']['no_publications'] = $row_hashtag['no_publications'];
            $array['hashtag_info']['mined_at'] = $row_hashtag['mined_at'];
            //print_r($row_hashtag);
            //print_r($array);
        }


        $query_users = "SELECT * FROM data_media WHERE MUID='$MUID' and caption_text like '%$node%'";
        $result_users = mysqli_query($conn, $query_users);
        $i_post = 0;
        while($row_users = mysqli_fetch_assoc($result_users)){
            $i_post++;
            //print_r($row_users);
            $array['post'][$i_post]['id'] = $row_users['id'];
            $array['post'][$i_post]['user_id'] = $row_users['user_id'];
            $array['post'][$i_post]['pk'] = $row_users['pk'];
            $array['post'][$i_post]['m_id'] = $row_users['m_id'];
            $array['post'][$i_post]['taken_at'] = $row_users['taken_at'];
            $array['post'][$i_post]['location'] = $row_users['location'];
            $array['post'][$i_post]['like_count'] = $row_users['like_count'];
            $array['post'][$i_post]['comment_count'] = $row_users['comment_count'];
            $array['post'][$i_post]['caption_text'] = hyphenize($row_users['caption_text']);
            $array['post'][$i_post]['media'] = $row_users['media'];
            $array['post'][$i_post]['product_type'] = $row_users['product_type'];
            $array['post'][$i_post]['media_type'] = $row_users['media_type'];
            $array['post'][$i_post]['hashtag_origin'] = $row_users['hashtag_origin'];
            $array['post'][$i_post]['hashtags_used'] = $row_users['hashtags_used'];
            $array['post'][$i_post]['inference_custom'] = $row_users['inference_custom'];
            $array['post'][$i_post]['hashtag_detection'] = $row_users['hashtag_detection'];
        }
        echo json_encode($array);
    }
    elseif( $_GET["nodeType"] == "user") {
        echo "user";
    }
    elseif( $_GET["nodeType"] == "post") {
        $array;
        $query_users = "SELECT * FROM data_media
        WHERE m_id='$node'
        ";
        $result_users = mysqli_query($conn, $query_users);
        $i_post = 0;
        while($row_users = mysqli_fetch_assoc($result_users)){
            $i_post++;
            //print_r($row_users);
            $array['post'][$i_post]['id'] = $row_users['id'];
            $array['post'][$i_post]['user_id'] = $row_users['user_id'];
            $array['post'][$i_post]['pk'] = $row_users['pk'];
            $array['post'][$i_post]['m_id'] = $row_users['m_id'];
            $array['post'][$i_post]['taken_at'] = $row_users['taken_at'];
            $array['post'][$i_post]['location'] = $row_users['location'];
            $array['post'][$i_post]['like_count'] = $row_users['like_count'];
            $array['post'][$i_post]['comment_count'] = $row_users['comment_count'];
            $array['post'][$i_post]['caption_text'] = hyphenize($row_users['caption_text']);
            $array['post'][$i_post]['media'] = $row_users['media'];
            $array['post'][$i_post]['product_type'] = $row_users['product_type'];
            $array['post'][$i_post]['media_type'] = $row_users['media_type'];
            $array['post'][$i_post]['hashtag_origin'] = $row_users['hashtag_origin'];
            $array['post'][$i_post]['hashtags_used'] = $row_users['hashtags_used'];
            $array['post'][$i_post]['inference_custom'] = $row_users['inference_custom'];
            $array['post'][$i_post]['hashtag_detection'] = $row_users['hashtag_detection'];
        }
        echo json_encode($array);
    }
} else {
    echo "There is not attr";
}

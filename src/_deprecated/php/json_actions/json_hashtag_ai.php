<?php
error_reporting(0);
header('Content-Type: application/json');
include("../db.php");
    function json_format($conn, $MUID){

            $data = [];
            $data['nodes'] =  array();
            $data['edges'] =  array();

         		//agregar nodos clave de BoW - dict
               	array_push($data['nodes'], array(
                										  'id'=> "graffiti_lingo",
                                      'label'=> "graffiti_lingo",
                                      'type'=> 'hashtag_class'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "railroad_lingo",
                                      'label'=> "railroad_lingo",
                                      'type'=> 'hashtag_class'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "city_dict",
                                      'label'=> "city_dict",
                                      'type'=> 'hashtag_class'
                                                ));
                //agregar nodos clave de AI_model
                //{"id":"3D","label":"3D","type":"ai_custom_inference"}
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_3D",
                                      'label'=> "3D",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_wildstyle",
                                      'label'=> "wildstyle",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_moniker",
                                      'label'=> "moniker",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_tag",
                                      'label'=> "tag",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_roller",
                                      'label'=> "roller",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_caracter",
                                      'label'=> "caracter",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_s_tren",
                                      'label'=> "s_tren",
                                      'type'=> 'ai_custom_inference'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "MLI_bomba",
                                      'label'=> "bomba",
                                      'type'=> 'ai_custom_inference'
                                                ));
                //agregar nodos clave de OOV -  writers - crew
                //{"id":"writer","label":"writer","type":"entity_sub"}
    			 			array_push($data['nodes'], array(
                										  'id'=> "oov_writer",
                                      'label'=> "oov_writer",
                                      'type'=> 'entity_sub'
                                                ));
    			 			array_push($data['nodes'], array(
                										  'id'=> "oov_crew",
                                      'label'=> "oov_crew",
                                      'type'=> 'entity_sub'
                                                ));
                                                // Dar de alta nodos hashtags
      $sql = "SELECT * FROM data_recent_hashtags WHERE MUID = '$MUID' LIMIT 9999;";

        if(!$result = mysqli_query($conn, $sql)) die();

            while($row = mysqli_fetch_assoc($result)) {
                //agregar nodo de hashtag
                array_push($data['nodes'], array('id'=> 'h_'.$row['hashtag'],
                                                'label'=> $row['hashtag'],
                                                'no_publications'=> $row['no_publications'],
                                                'type'=> 'hashtag') );

                           }

      $sqlUser = "SELECT * FROM data_users WHERE MUID = '$MUID' LIMIT 9999;";

          if(!$resultUsers = mysqli_query($conn, $sqlUser)) die();

                while($sqlUsers = mysqli_fetch_assoc($resultUsers)) {
                      //agregar nodo de usuario
                      array_push($data['nodes'], array('id'=> 'u_'.$sqlUsers['username'],
                                                      'label'=> $sqlUsers['username'],
                                                      'type'=> 'user',
                                                      'media_count'=> $sqlUsers['media_count'],
                                                      'following'=> $sqlUsers['following_count'],
                                                      'follower'=> $sqlUsers['follower_count'],
                                                      'private'=> $sqlUsers['is_private'],
                                                    ));

                                                }
        $sqlPosts = "SELECT * FROM data_media WHERE MUID = '$MUID';";
        if(!$rowPosts = mysqli_query($conn, $sqlPosts)) die();
            while($post = mysqli_fetch_assoc($rowPosts)) {
                 //print_r($post);
                //agregar node de publicación
                array_push($data['nodes'], array('id'=> $post['m_id'],
                                                'label'=> $post['user_id']."+".$post['m_id'],
                                                'type'=> 'post',
                                                'likes' => $post['like_count'],
                                                'comments' => $post['comment_count'],
                                                'hashtag_origin' => $post['hashtag_origin'],
                                                'product_type' => $post['product_type']
                                                ));
                //agregar node de usuario
                /*
                array_push($data['nodes'], array('id'=> 'u_'.$post['user_id'],
                                                'label'=> $post['user_id'],
                                                'type'=> 'user'));
                                                */

                //agregar edges de usuario a publicación
                array_push($data['edges'], array('source'=> 'u_'.$post['user_id'],
                                           'target'=> $post['m_id']));

              //agregar edges de usuario a hashtag donde se mino la conversación
              //quita muchos recursos no se puede correr

              //array_push($data['edges'], array('source'=> 'u_'.$post['user_id'],
                            //'target'=> 'h_'.$post['hashtag_origin']
                                          //));

               //agregar inferencias de imagenes

    			 $inference = json_decode($post['inference_custom']);

              foreach($inference as $inf){
              			//echo("printing inferences");
               			//echo $inf[0];
               			//echo $inf[1];

               			 //pendiente agregarlos solo una vez
                		//array_push($data['nodes'], array(
                		//								   'id'=> $inf[0],
                    //                            'label'=> $inf[0],
                    //                            'type'=> 'ai_custom_inference'
                    //                            ));

                     //agregar edges de usuario a publicación
                	  array_push($data['edges'], array(
                	  								'source'=> $post['m_id'],
                                           'target'=> 'MLI_'.$inf[0],
                                           'score' => $inf[1]
                                           ));
    						}

                $inferenceWorld = json_decode($post['inference_world']);

                   foreach($inferenceWorld as $inf){
                         //echo("printing inferences");
                         //echo $inf[0];
                         //echo $inf[1];
                            if(!in_array($inf[0], $data['nodes'], true)){
                              //pendiente agregarlos solo una vez
                             array_push($data['nodes'], array(
                                               'id'=> 'MLI_'.$inf[0],
                                               'label'=> $inf[0],
                                               'type'=> 'ai_world_inference'
                                                        ));
                            }



                          //agregar edges de usuario a publicación
                         array_push($data['edges'], array(
                                         'source'=> $post['m_id'],
                                                'target'=> 'MLI_'.$inf[0],
                                                'score' => $inf[1]
                                                ));
                     }



        $hashtags = json_decode($post['hashtags_used'], true);
              if (!strpos($post['hashtags_used'], "#") !== false) {
                      foreach ($hashtags as $hash) {
                        array_push($data['nodes'], array(
                                          'id'=> 'h_'.$hash,
                                          'label'=> $hash,
                                          'type'=> 'hashtag'
                                                    ));

                           array_push($data['edges'], array('source'=> $post['m_id'],
                                                   'target'=> 'h_'.$hash));
                                    }
                        }


    	 $hashtag_detection = json_decode($post['hashtag_detection']);

    			 //print_r($hashtag_detection);

              foreach($hashtag_detection as $ha_det){
              			//echo("printing hashtag detections");
               			//echo $ha_det[0];
               			//echo $ha_det[1];
               			//echo $ha_det[2];

               			if($ha_det[1] == "entity") {

               					 //agregar node de entity
    		            		array_push($data['nodes'], array(
    		            										  'id'=> 'ent_'.$ha_det[0],
    		                                  'label'=> $ha_det[0],
    		                                  'type'=> 'entity_individual'
    		                                            ));
    		                  //agregar categoria de entity
    		                 //array_push($data['nodes'], array(
    		            		 //								  'id'=> $ha_det[2],
    		                 //                           'label'=> $ha_det[2],
    		                 //                           'type'=> 'entity_sub'
    		                 //                           ));

    		                //agregar edges de entity individual a  entity_sub
    		            	  array_push($data['edges'], array(
    		            	  								'source'=> 'ent_'.$ha_det[0],
    		                                'target'=> 'oov_'.$ha_det[2],
    		                                       ));

    		                //agregar edges de entity individual  a publicación
    		            	  array_push($data['edges'], array(
    		            	  								'source'=> 'ent_'.$ha_det[0],
                                        'target'=> 'h_'.$ha_det[0],
                                        //'target'=> $post['m_id']
    		                                       ));

    		                //agregar edges de entity individual  a publicación
    		            	  //array_push($data['edges'], array(
    		            	  //								'source'=> 'ent_'.$ha_det[0],
                        //                'target'=> $post['m_id']
    		                //                       ));

               			} else {

    		           			 //agregar node de hashtag
    		            		//array_push($data['nodes'], array(
    		            		//								  'id'=> 'dict_'.$ha_det[0],
    		                //                           'label'=> $ha_det[0],
    		                //                            'type'=> 'ai_text_hashtag'
    		                 //                           ));

    		                 //agregar node de word
    		                 array_push($data['nodes'], array(
    		            										  'id'=> $ha_det[2],
    		                                            'label'=> $ha_det[2],
    		                                            'type'=> 'ai_text_word'
    		                                            ));

    		                 //agregar edges de usuario a publicación
    		            	  array_push($data['edges'], array(
    		            	  								'source'=> 'h_'.$ha_det[0],
    		                                'target'=> $ha_det[2],
    		                                       ));

                        //agregar edge de publicación a entidad pero _dict
                        if ($ha_det[1] != "city"){
      		                 array_push($data['edges'], array(
      		            	  								'source'=> $ha_det[2],
      		                                 'target'=> $ha_det[1],
      		                                       ));
                       }else {
                           array_push($data['edges'], array(
                                        'source'=> $ha_det[2],
                                        'target'=> "city_dict",
                                               ));

                       }

                       //array_push($data['edges'], array(
                      //               'source'=> 'dict_'.$ha_det[0],
                      //               'target'=> $post['m_id']
                      //                        ));

    								}

    						}


                }

                return $data;
        }

    function json_format_sliced($conn, $MUID, $iteration_no){
            $it_start = ($iteration_no * 1000);
            $it_end = ($iteration_no * 1000) + 999;
            //echo  "json_format_sliced - before sql: ".$MUID;

            // Dar de alta nodos hashtags
        $sql = "SELECT * FROM data_recent_hashtags WHERE MUID = '$MUID' LIMIT 999;";
            $data = [];
            $data['nodes'] =  array();
            $data['edges'] =  array();
        if(!$result = mysqli_query($conn, $sql)) die();

            while($row = mysqli_fetch_assoc($result)) {
                //print_r($row);
                array_push($data['nodes'], array('id'=> $row['hashtag'],
                                                'label'=> $row['hashtag'],
                                                'type'=> 'hashtag') );

                           }

        $sqlPosts = "SELECT * FROM data_media WHERE MUID = '$MUID';";
        if(!$rowPosts = mysqli_query($conn, $sqlPosts)) die();
            while($post = mysqli_fetch_assoc($rowPosts)) {
                    //print_r($row);
                //agregar node de publicación
                array_push($data['nodes'], array('id'=> $post['m_id'],
                                                //'label'=> $row['user_id']."+".$row['m_id'],
                                                'label'=> $post['user_id']."+".$post['m_id'],
                                                'type'=> 'post'));
                //agregar node de usuario
                array_push($data['nodes'], array('id'=> $post['user_id'],
                                                'label'=> $post['user_id'],
                                                'type'=> 'user'));
                array_push($data['edges'], array('source'=> $post['user_id'],
                                           'target'=> $post['m_id']));

                $hashtags = json_decode($post['hashtags_used'], true);
                foreach ($hashtags as $hash) {
                   array_push($data['edges'], array('source'=> $post['m_id'],
                                           'target'=> $hash));
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
        //echo  "sliceSQLFetch: ".$MUID;
        //echo  "total ".$totalRows;
        //echo  "it_ne: ".$iterations_needed;
        //echo  "it_no: ".$i;
        $json_string = json_encode( json_format_sliced($conn, $MUID, $i) );
        //echo  $json_string;
        $file = '.././json/ai/'. $MUID .'_'.$i++.'.json';
        file_put_contents($file, $json_string);
        //file_put_contents($file, "pr");
        //echo  "vive";
        //$iterations_needed = $iterations_needed - 1;
        //echo  $iterations_needed;
        if ($iterations_needed > $i){
            //echo  "menos";
            //echo  $iterations_needed;
            $actual = 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'/?MUID='.$MUID.'&it_no='.$i;
            //echo  $actual;
            header("Location: $actual");
            die();
        } else {
            $dir = '.././json/ai/';
            $jsonFiles = array();
            foreach (glob("$dir/*") as $file) {
                if (strpos($file, $MUID) !== false) {
                $file= str_replace(".././json/ai/", "", $file);
                array_push($jsonFiles, $file);
                }
            }
            //echo json_encode($jsonFiles);
            die();
        }
    }


//generamos la consulta
if ( isset($_GET["MUID"]) ){
   // freightgraffiti_1_hashtagTop_9_5d8799fe
$MUID = $_GET["MUID"];
	//echo $MUID;


$sqlCount = "SELECT id FROM data_recent_hashtags WHERE MUID = '$MUID';";
mysqli_set_charset($conn, "utf8"); //formato de datos utf8
if(!$rowCount = mysqli_query($conn, $sqlCount)) die();
$totalRows = mysqli_num_rows($rowCount);
//echo  $totalRows;
    if($totalRows > 9999){
            //echo  "after 999 ".$MUID;
            $iteration_no = 0;
            sliceSQLFetch($totalRows, $iteration_no, $MUID, $conn);
    } else {
            $json_string = json_encode(json_format($conn, $MUID));
            //echo  $json_string;
            $file = '.././json/ai/'. $MUID .'_01.json';
            file_put_contents($file, $json_string);
            header("Location: ./json_scandir_ai.php?MUID=".$MUID);
        }

//desconectamos la base de datos
$close = mysqli_close($conn)
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");

} else {
    //echo "Falta MUID";
}

?>

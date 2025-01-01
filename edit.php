<?php
include("db.php");
$title = '';
$description= '';

if  (isset($_GET['id'])) {
  $id = $_GET['id'];
  $query_tasks = "SELECT * FROM tasks WHERE id=$id";
  $result_tasks = mysqli_query($conn, $query_tasks);
  if (mysqli_num_rows($result_tasks) == 1) {
    $row_tasks = mysqli_fetch_array($result_tasks);
    $MUID = $row_tasks['MUID'];
    $mining_type = $row_tasks['mining_type'];
  }
}


if (isset($_POST['update'])) {
  $id = $_GET['id'];
  $title= $_POST['title'];
  $description = $_POST['description'];

  $query = "UPDATE task set title = '$title', description = '$description' WHERE id=$id";
  mysqli_query($conn, $query);
  $_SESSION['message'] = 'Task Updated Successfully';
  $_SESSION['message_type'] = 'warning';
  header('Location: index.php');
}

if( isset($_GET['delete_json']) && $_GET['delete_json'] == $MUID  ) {
echo("deleting");
  foreach (glob("./json/ai/".$MUID."*.json") as $filename) {
      // Use unlink() function to delete a file
      if (!unlink($filename)) {
          echo ("$filename cannot be deleted due to an error");
      }
      else {
          echo ("$filename has been deleted");
      }
    }
    return;   
}

?>
<?php include('includes/header.php'); ?>
<script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
<div class="container p-4">

<div class="row">
    <div class="col-md-12">
      <div class="card card-body">
          <h3>Visualization tools</h3>
          <?php
            if(strpos($row_tasks['mining_type'], 'hashtag') === 0) {
        //Hashtag_red button
            ?>
          <a href="hashtags_ai_data_live.php?id=<?php echo $id?>" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Network graph with Sigma.js + Graphology</a>

           <?php
            }

            if(strpos($row_tasks['mining_type'], 'user') === 0) {
        //Hashtag_red button
            ?>
          <a href="sigma.php?id=<?php echo $id?>" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Network graph with Sigma.js + Graphology</a>

           <?php
         }?>

         <hr>
         <div>
           <h6>JSON Network Cache</h6>
           <?php
           foreach (glob("./json/ai/".$MUID."*.json") as $filename) {
             $filename_show = str_replace("./json/ai/", "", $filename);
             echo "<p>". $filename_show . " generated - " . date ("F d Y H:i:s", filemtime($filename) ) . "</p>";
             }
            ?>
         </div>
         <?
            if( isset($_GET['editor']) && $_GET['editor'] == 'fauxSecurityWord'  ) { ?>

            <a target="_blank" href="?id=<?php echo $id?>&delete_json=<?php echo $MUID?>&editor=<?php echo$_GET['editor'] ?>" class="btn btn-primary btn-lg active btn-danger" role="button" aria-pressed="true">Delete JSON network </a>
              <br>
            <a target="_blank" href="json_actions/json_scandir_ai.php?MUID=<?php echo $MUID?>" class="btn btn-primary btn-lg active btn-success" role="button" aria-pressed="true">Regenarte JSON, (only after deleted)</a>
            <?php
             }
           ?>
      </div>
    </div>
  </div>
</div>
<hr>
<div class="row">
    <div class="col-md-12">
      <div class="card card-body">
        <h3><?php echo $MUID ?></h3>
        <?php
          if  (isset($MUID)) {
          ?>
          <table class="table table-bordered">
        <thead>
          <tr>
            <th>MUID</th>
            <th>Seed Node</th>
            <th>Depth</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Created At</th>
            <th>Username Bot</th>
            <th>Iteration</th>
            <th>Status</th>
            <th>Finished At</th>
            <?
            if( isset($_GET['editor']) && $_GET['editor'] == 'abundis'  ) {
              echo "<th> - </th>";
              }
              ?>
          </tr>
        </thead>
        <tbody style="">

          <?php
          $query_queue = "SELECT * FROM queue WHERE MUID='$MUID'";
          $result_queue = mysqli_query($conn, $query_queue);
           while($row_queue = mysqli_fetch_assoc($result_queue)){ ?>
          <tr>
            <td><?php echo $row_queue['MUID']; ?></td>
            <td><?php echo $row_queue['seed_node']; ?></td>
            <td><?php echo $row_queue['mining_depth']; ?></td>
            <td><?php echo $row_queue['mining_type']; ?></td>
            <td><?php echo $row_queue['hashtag_media_amount']; ?></td>
            <td><?php echo $row_queue['created_at']; ?></td>
            <td><?php echo $row_queue['bot_username']; ?></td>
            <td><?php echo $row_queue['iteration_no']; ?></td>
            <td><?php echo $row_queue['status']; ?></td>
            <td><?php echo $row_queue['finished_at']; ?></td>
            <?
            if( isset($_GET['editor']) && $_GET['editor'] == 'abundis'  ) {
              ?>
              <td>
              <a queueId="<?php echo $row_queue['id']?>" MUID="<?php echo $row_queue['MUID']?>" hashtagNode="<?php echo $row_queue['seed_node']; ?>" href="#" class="delete-queue btn btn-danger">
                <i class="far fa-trash-alt"></i>
              </a>
            </td>
              <?
              }
              ?>
          </tr>
          <?php }

             } else {
              echo "There is no MUID";
          }?>
        </tbody>
      </table>
      </div>
    </div>
</div>

</div>

<script>

jQuery('.delete-queue').click(function(e){
  e.preventDefault();
  queueId = $(this).attr("queueId");
  m_MUID = $(this).attr("MUID");
  hashtagNode = $(this).attr("hashtagNode");
  delete_queue(queueId);
  //delete_queue();
});

function delete_queue(queueId){
    //var info = 'id=' + id;
    var data  = {id: queueId, m_MUID: m_MUID, hashtagNode: hashtagNode};
    if(confirm("Are you sure you want to delete "+hashtagNode+" ?")){
        var html = $.ajax({
        type: "POST",
        url: "db_actions/queue_delete.php",
        data: data,
        async: false
        }).responseText;

        if(html == "deleted")
        {
            console.log("queue deleted")
            return true;

        }
        else
        {
            console.log("something happens :(")
            return false;
        }
    }
}
</script>
<?php include('includes/footer.php'); ?>

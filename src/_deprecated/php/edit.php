<?php
include("db.php");

$title = '';
$description = '';
$row_tasks = null;
$MUID = '';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $query_tasks = "SELECT * FROM tasks WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query_tasks);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result_tasks = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result_tasks) == 1) {
        $row_tasks = mysqli_fetch_array($result_tasks);
        $MUID = $row_tasks['MUID'];
        $mining_type = $row_tasks['mining_type'];
    }
}

// Sorting logic for Hashtags table
$h_sort = isset($_GET['h_sort']) ? $_GET['h_sort'] : 'no_publications';
$h_order = isset($_GET['h_order']) && $_GET['h_order'] == 'asc' ? 'asc' : 'desc';
$h_allowed = ['hashtag', 'no_publications', 'mined_at'];
if (!in_array($h_sort, $h_allowed)) $h_sort = 'no_publications';

// Sorting logic for Posts table
$p_sort = isset($_GET['p_sort']) ? $_GET['p_sort'] : 'taken_at';
$p_order = isset($_GET['p_order']) && $_GET['p_order'] == 'asc' ? 'asc' : 'desc';
$p_allowed = ['user_id', 'like_count', 'comment_count', 'taken_at'];
if (!in_array($p_sort, $p_allowed)) $p_sort = 'taken_at';

function edit_sort_url($prefix, $col, $currentSort, $currentOrder) {
    $params = $_GET;
    $params[$prefix . '_sort'] = $col;
    $params[$prefix . '_order'] = ($col == $currentSort && $currentOrder == 'asc') ? 'desc' : 'asc';
    return "?" . http_build_query($params);
}

function edit_sort_icon($col, $currentSort, $currentOrder) {
    if ($col != $currentSort) return '<small class="text-muted"><i class="fas fa-sort"></i></small>';
    return ($currentOrder == 'asc') ? '<small><i class="fas fa-sort-up"></i></small>' : '<small><i class="fas fa-sort-down"></i></small>';
}

if (isset($_POST['update']) && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $title = mysqli_real_escape_string($conn, $_POST['title']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);

    $query = "UPDATE task set title = ?, description = ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ssi", $title, $description, $id);
    mysqli_stmt_execute($stmt);
    
    $_SESSION['message'] = 'Task Updated Successfully';
    $_SESSION['message_type'] = 'warning';
    header('Location: index.php');
    exit;
}

if (isset($_GET['delete_json']) && isset($MUID) && $_GET['delete_json'] === $MUID) {
    echo "Deleting files for MUID: " . htmlspecialchars($MUID) . "<br>";
    $pattern = "./json/ai/" . basename($MUID) . "*.json";
    foreach (glob($pattern) as $filename) {
        if (unlink($filename)) {
            echo htmlspecialchars($filename) . " has been deleted.<br>";
        } else {
            echo htmlspecialchars($filename) . " cannot be deleted due to an error.<br>";
        }
    }
    exit;
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
<?php
          if (isset($MUID)) : 
              // Query totals
              $query_posts = "SELECT COUNT(*) as total FROM data_media WHERE MUID = ?";
              $stmt_p = mysqli_prepare($conn, $query_posts);
              mysqli_stmt_bind_param($stmt_p, "s", $MUID);
              mysqli_stmt_execute($stmt_p);
              $res_p = mysqli_stmt_get_result($stmt_p);
              $total_records = mysqli_fetch_assoc($res_p)['total'];

              $query_h = "SELECT COUNT(*) as total FROM data_recent_hashtags WHERE MUID = ?";
              $stmt_h = mysqli_prepare($conn, $query_h);
              mysqli_stmt_bind_param($stmt_h, "s", $MUID);
              mysqli_stmt_execute($stmt_h);
              $res_h = mysqli_stmt_get_result($stmt_h);
              $total_hashtags = mysqli_fetch_assoc($res_h)['total'];
          ?>
            <div class="row mt-3 text-center">
              <div class="col-md-6">
                <div class="alert alert-info py-2">
                  <h5 class="mb-0">Network Posts: <strong><?php echo $total_records; ?></strong></h5>
                </div>
              </div>
              <div class="col-md-6">
                <div class="alert alert-success py-2">
                  <h5 class="mb-0">Mined Hashtags: <strong><?php echo $total_hashtags; ?></strong></h5>
                </div>
              </div>
            </div>
          <?php endif; ?>

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
        <?php if (isset($_GET['editor']) && $_GET['editor'] == 'abundis') : ?>
          <a target="_blank" href="?id=<?php echo intval($id); ?>&delete_json=<?php echo htmlspecialchars($MUID); ?>&editor=<?php echo htmlspecialchars($_GET['editor']); ?>" class="btn btn-primary btn-lg active btn-danger" role="button" aria-pressed="true">Delete JSON network </a>
          <br>
          <a target="_blank" href="json_actions/json_scandir_ai.php?MUID=<?php echo urlencode($MUID); ?>" class="btn btn-primary btn-lg active btn-success" role="button" aria-pressed="true">Regenerate JSON (only after deleted)</a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
<!-- 
<hr>
<div class="row">
    <div class="col-md-12">
      <div class="card card-body">
        <h3><?php echo htmlspecialchars($MUID); ?></h3>
        <?php if (isset($MUID)) : ?>
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
                <?php if (isset($_GET['editor']) && $_GET['editor'] == 'abundis') : ?>
                  <th> Actions </th>
                <?php endif; ?>
              </tr>
            </thead>
            <tbody>
              <?php
              $query_queue = "SELECT * FROM queue WHERE MUID = ?";
              $stmt_queue = mysqli_prepare($conn, $query_queue);
              mysqli_stmt_bind_param($stmt_queue, "s", $MUID);
              mysqli_stmt_execute($stmt_queue);
              $result_queue = mysqli_stmt_get_result($stmt_queue);
              while ($row_queue = mysqli_fetch_assoc($result_queue)) : ?>
                <tr>
                  <td><?php echo htmlspecialchars($row_queue['MUID']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['seed_node']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['mining_depth']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['mining_type']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['hashtag_media_amount']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['created_at']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['bot_username']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['iteration_no']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['status']); ?></td>
                  <td><?php echo htmlspecialchars($row_queue['finished_at']); ?></td>
                  <?php if (isset($_GET['editor']) && $_GET['editor'] == 'abundis') : ?>
                    <td>
                      <a queueId="<?php echo $row_queue['id']; ?>" MUID="<?php echo htmlspecialchars($row_queue['MUID']); ?>" hashtagNode="<?php echo htmlspecialchars($row_queue['seed_node']); ?>" href="#" class="delete-queue btn btn-danger">
                        <i class="far fa-trash-alt"></i>
                      </a>
                    </td>
                  <?php endif; ?>
                </tr>
              <?php endwhile; ?>
            </tbody>
          </table>
        <?php else : ?>
          <p>There is no MUID</p>
        <?php endif; ?>
      </div>
    </div>
</div>
-->

<hr>
<div class="row">
    <div class="col-md-12">
      <div class="card card-body">
        <h3>Network Hashtags</h3>
        <?php if (isset($MUID)) : ?>

          <!-- Tabla 1: Hashtags -->
          <div class="table-responsive mb-4" style="max-height: 400px; overflow-y: auto;">
            <table class="table table-bordered table-sm">
              <thead class="thead-light">
                <tr>
                  <th><a href="<?php echo edit_sort_url('h', 'hashtag', $h_sort, $h_order); ?>" class="text-dark">Hashtag <?php echo edit_sort_icon('hashtag', $h_sort, $h_order); ?></a></th>
                  <th><a href="<?php echo edit_sort_url('h', 'no_publications', $h_sort, $h_order); ?>" class="text-dark">Publications (IG Total) <?php echo edit_sort_icon('no_publications', $h_sort, $h_order); ?></a></th>
                  <th><a href="<?php echo edit_sort_url('h', 'mined_at', $h_sort, $h_order); ?>" class="text-dark">Capture Date <?php echo edit_sort_icon('mined_at', $h_sort, $h_order); ?></a></th>
                </tr>
              </thead>
              <tbody>
                <?php
                $query_h_data = "SELECT * FROM data_recent_hashtags WHERE MUID = ? ORDER BY $h_sort $h_order";
                $stmt_h_data = mysqli_prepare($conn, $query_h_data);
                mysqli_stmt_bind_param($stmt_h_data, "s", $MUID);
                mysqli_stmt_execute($stmt_h_data);
                $result_h_data = mysqli_stmt_get_result($stmt_h_data);
                if (mysqli_num_rows($result_h_data) == 0) : ?>
                  <tr><td colspan="3" class="text-center">No mined hashtags found</td></tr>
                <?php else :
                  while ($row_h_data = mysqli_fetch_assoc($result_h_data)) : ?>
                    <tr>
                      <td><strong>#<?php echo htmlspecialchars($row_h_data['hashtag']); ?></strong></td>
                      <td><?php echo number_format($row_h_data['no_publications']); ?></td>
                      <td><small><?php echo htmlspecialchars($row_h_data['mined_at']); ?></small></td>
                    </tr>
                  <?php endwhile;
                endif; ?>
              </tbody>
            </table>
          </div>

          <hr>
          <h3>Network Posts</h3>
          <!-- Tabla 2: Posts -->
          <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
            <table class="table table-bordered table-sm">
              <thead class="thead-light">
                <tr>
                  <th><a href="<?php echo edit_sort_url('p', 'user_id', $p_sort, $p_order); ?>" class="text-dark">User <?php echo edit_sort_icon('user_id', $p_sort, $p_order); ?></a></th>
                  <th>Caption</th>
                  <th><a href="<?php echo edit_sort_url('p', 'like_count', $p_sort, $p_order); ?>" class="text-dark">Likes <?php echo edit_sort_icon('like_count', $p_sort, $p_order); ?></a></th>
                  <th><a href="<?php echo edit_sort_url('p', 'comment_count', $p_sort, $p_order); ?>" class="text-dark">Comments <?php echo edit_sort_icon('comment_count', $p_sort, $p_order); ?></a></th>
                  <th>Hashtags Used</th>
                  <th><a href="<?php echo edit_sort_url('p', 'taken_at', $p_sort, $p_order); ?>" class="text-dark">Taken At <?php echo edit_sort_icon('taken_at', $p_sort, $p_order); ?></a></th>
                </tr>
              </thead>
              <tbody>
                <?php
                $query_media = "SELECT * FROM data_media WHERE MUID = ? ORDER BY $p_sort $p_order LIMIT 100";
                $stmt_media = mysqli_prepare($conn, $query_media);
                mysqli_stmt_bind_param($stmt_media, "s", $MUID);
                mysqli_stmt_execute($stmt_media);
                $result_media = mysqli_stmt_get_result($stmt_media);
                if (mysqli_num_rows($result_media) == 0) : ?>
                  <tr><td colspan="6" class="text-center">No media data found for this MUID</td></tr>
                <?php else :
                  while ($row_media = mysqli_fetch_assoc($result_media)) : ?>
                    <tr>
                      <td><?php echo htmlspecialchars($row_media['user_id']); ?></td>
                      <td title="<?php echo htmlspecialchars($row_media['caption_text']); ?>">
                        <?php echo htmlspecialchars(substr($row_media['caption_text'], 0, 70)) . (strlen($row_media['caption_text']) > 70 ? '...' : ''); ?>
                      </td>
                      <td><?php echo htmlspecialchars($row_media['like_count']); ?></td>
                      <td><?php echo htmlspecialchars($row_media['comment_count']); ?></td>
                      <td>
                        <?php 
                        $tags = json_decode($row_media['hashtags_used'], true);
                        if (is_array($tags)) {
                            echo '<small class="text-muted">' . htmlspecialchars(implode(', ', $tags)) . '</small>';
                        } else {
                            echo '<small class="text-muted">' . htmlspecialchars($row_media['hashtags_used']) . '</small>';
                        }
                        ?>
                      </td>
                      <td><small><?php echo htmlspecialchars($row_media['taken_at']); ?></small></td>
                    </tr>
                  <?php endwhile;
                endif; ?>
              </tbody>
            </table>
          </div>
        <?php else : ?>
          <p>MUID not set</p>
        <?php endif; ?>
      </div>
    </div>
</div>


</div>

<script>

jQuery('.delete-queue').click(function(e) {
    e.preventDefault();
    const queueId = jQuery(this).attr("queueId");
    const m_MUID = jQuery(this).attr("MUID");
    const hashtagNode = jQuery(this).attr("hashtagNode");
    delete_queue(queueId, m_MUID, hashtagNode);
});

function delete_queue(queueId, m_MUID, hashtagNode) {
    const data = {
        id: queueId,
        m_MUID: m_MUID,
        hashtagNode: hashtagNode
    };
    if (confirm("Are you sure you want to delete " + hashtagNode + " ?")) {
        jQuery.ajax({
            type: "POST",
            url: "db_actions/queue_delete.php",
            data: data,
            success: function(response) {
                if (response === "deleted") {
                    console.log("queue deleted");
                    location.reload(); // Reload to show changes
                } else {
                    console.log("something happens :(");
                }
            },
            error: function() {
                console.log("Error communicating with server");
            }
        });
    }
}
</script>
<?php include('includes/footer.php'); ?>

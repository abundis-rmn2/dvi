<?php include("db.php"); ?>
<?php include('includes/functions.php'); ?>
<?php include('includes/header.php'); ?>
<?php
// Sorting logic
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'created_at';
$order = isset($_GET['order']) && $_GET['order'] == 'asc' ? 'asc' : 'desc';

// Allowed columns to prevent injection
$allowed_sort = ['MUID', 'seed_node', 'mining_depth', 'hashtag_media_amount', 'p_count', 'h_count', 'created_at'];
if (!in_array($sort, $allowed_sort)) $sort = 'created_at';

function sort_url($col, $currentSort, $currentOrder) {
    $newOrder = ($col == $currentSort && $currentOrder == 'asc') ? 'desc' : 'asc';
    $editor = isset($_GET['editor']) ? '&editor=' . urlencode($_GET['editor']) : '';
    return "?sort=$col&order=$newOrder$editor";
}

function sort_icon($col, $currentSort, $currentOrder) {
    if ($col != $currentSort) return '<i class="fas fa-sort text-muted"></i>';
    return ($currentOrder == 'asc') ? '<i class="fas fa-sort-up"></i>' : '<i class="fas fa-sort-down"></i>';
}

$query = "SELECT t.*, 
    (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID) as p_count,
    (SELECT COUNT(*) FROM data_recent_hashtags WHERE MUID = t.MUID) as h_count
FROM tasks t ORDER BY $sort $order";
$result_tasks = mysqli_query($conn, $query);
?>

<main class="container p-4">
  <div class="row">
    <div class="col-md-12">
      <?php create_task_form() ?>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <div class="table-responsive" style="max-height: 800px; overflow-y: auto;">
        <table class="table table-bordered table-sm">
          <thead class="thead-light">
          <tr>
            <th><a href="<?php echo sort_url('MUID', $sort, $order); ?>" class="text-dark">MUID <?php echo sort_icon('MUID', $sort, $order); ?></a></th>
            <th><a href="<?php echo sort_url('seed_node', $sort, $order); ?>" class="text-dark">Seed Node <?php echo sort_icon('seed_node', $sort, $order); ?></a></th>
            <th><a href="<?php echo sort_url('mining_depth', $sort, $order); ?>" class="text-dark">Depth <?php echo sort_icon('mining_depth', $sort, $order); ?></a></th>
            <!-- <th>Type</th> -->
            <th><a href="<?php echo sort_url('hashtag_media_amount', $sort, $order); ?>" class="text-dark">Amount <?php echo sort_icon('hashtag_media_amount', $sort, $order); ?></a></th>
            <th><a href="<?php echo sort_url('p_count', $sort, $order); ?>" class="text-dark">Posts <?php echo sort_icon('p_count', $sort, $order); ?></a></th>
            <th><a href="<?php echo sort_url('h_count', $sort, $order); ?>" class="text-dark">Hashtags <?php echo sort_icon('h_count', $sort, $order); ?></a></th>
            <th><a href="<?php echo sort_url('created_at', $sort, $order); ?>" class="text-dark">Created At <?php echo sort_icon('created_at', $sort, $order); ?></a></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          <?php
          while($row = mysqli_fetch_assoc($result_tasks)) { 
            $p_count = $row['p_count'];
            $h_count = $row['h_count'];
            $is_empty = ($p_count == 0 && $h_count == 0);
          ?>
          <tr class="<?php echo $is_empty ? 'table-danger text-muted' : ''; ?>">
            <td title="<?php echo htmlspecialchars($row['MUID']); ?>">
                <small><?php echo htmlspecialchars(strlen($row['MUID']) > 20 ? substr($row['MUID'], 0, 12) . '...' . substr($row['MUID'], -6) : $row['MUID']); ?></small>
            </td>
            <td><?php echo htmlspecialchars($row['seed_node']); ?></td>
            <td><?php echo htmlspecialchars($row['mining_depth']); ?></td>
            <!-- <td><?php echo htmlspecialchars($row['mining_type']); ?></td> -->
            <td><?php echo htmlspecialchars($row['hashtag_media_amount']); ?></td>
            <td><span class="badge badge-pill <?php echo $p_count > 0 ? 'badge-info' : 'badge-danger'; ?>"><?php echo $p_count; ?></span></td>
            <td><span class="badge badge-pill <?php echo $h_count > 0 ? 'badge-success' : 'badge-danger'; ?>"><?php echo $h_count; ?></span></td>
            <td><small><?php echo htmlspecialchars($row['created_at']); ?></small></td>
            <td class="text-center">
              <a href="edit.php?id=<?php echo $row['id']; ?><?php echo isset($_GET['editor']) ? '&editor=' . htmlspecialchars($_GET['editor']) : ''; ?>" class="btn btn-secondary btn-sm">
                <i class="fas fa-marker"></i>
              </a>
              <?php if (isset($_GET['editor']) && $_GET['editor'] == 'abundis') : ?>
                <a href="delete_task.php?id=<?php echo $row['id']; ?>&MUID=<?php echo htmlspecialchars($row['MUID']); ?>" class="btn btn-danger btn-sm">
                  <i class="far fa-trash-alt"></i>
                </a>
              <?php endif; ?>
            </td>
          </tr>
          <?php } ?>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</main>
<?php include('includes/footer.php'); ?>

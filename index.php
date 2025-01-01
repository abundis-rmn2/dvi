<?php include("db.php"); ?>
<?php include('includes/functions.php'); ?>
<?php include('includes/header.php'); ?>

<main class="container p-4">
  <div class="row">
    <div class="col-md-12">
      <?php create_task_form() ?>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>MUID</th>
            <th>Seed Node</th>
            <th>Depth</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>

          <?php
          $query = "SELECT * FROM tasks";
          $result_tasks = mysqli_query($conn, $query);

          while($row = mysqli_fetch_assoc($result_tasks)) { ?>
          <tr>
            <td><?php echo $row['MUID']; ?></td>
            <td><?php echo $row['seed_node']; ?></td>
            <td><?php echo $row['mining_depth']; ?></td>
            <td><?php echo $row['mining_type']; ?></td>
            <td><?php echo $row['hashtag_media_amount']; ?></td>
            <td><?php echo $row['created_at']; ?></td>
            <td>



<? if( isset($_GET['editor']) && $_GET['editor'] == 'abundis'  ) { ?>
              <a href="edit.php?id=<?php echo $row['id'].'&editor='.$_GET['editor']?>" class="btn btn-secondary">
                <i class="fas fa-marker"></i>
              </a>
              <a href="delete_task.php?id=<?php echo $row['id']?>&MUID=<?php echo $row['MUID']?>" class="btn btn-danger">
                <i class="far fa-trash-alt"></i>
              </a>
            </td>
<? } else {
  ?>
  <a href="edit.php?id=<?php echo $row['id']?>" class="btn btn-secondary">
    <i class="fas fa-marker"></i>
  </a>
  <?
}?>
          </tr>
          <?php } ?>
        </tbody>
      </table>
    </div>
  </div>
</main>
<?php include('includes/footer.php'); ?>

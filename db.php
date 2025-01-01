<?php
session_start();

$conn = mysqli_connect(
  '[SERVER]',
  '[DATABASE_USER]',
  '[DATABASE_PASSWORD]',
  '[DATABASE_NAME]'
) or die(mysqli_erro($mysqli));

?>

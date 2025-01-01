<?php

function create_task_form() {

  if (isset($_SESSION["message"])) {
    echo '
    <!-- MESSAGES -->
    <div class="alert alert-'. $_SESSION["message_type"] .' alert-dismissible fade show" role="alert">
      '. $_SESSION["message"].'
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>'; 
    session_unset(); }

    echo '
    <!-- ADD TASK FORM -->
    <div class="card card-body">
    <form action="save_task.php" method="POST">
      <div class="muid form-group row">
        <label for="muid" class="col-4 col-form-label">muid</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-diamond"></i>
              </div>
            </div> 
            <input id="muid" name="muid" placeholder="muid" type="text" class="form-control">
          </div>
        </div>
      </div>
      <div class="seednode form-group row">
        <label for="seednode" class="col-4 col-form-label">Seed Node</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-instagram"></i>
              </div>
            </div> 
            <input id="seednode" name="seednode" placeholder="#hashtag or @user" type="text" class="form-control" required="required">
          </div>
        </div>
      </div>
      <div class="depth form-group row">
        <label class="col-4">Mining Depth</label> 
        <div class="col-8">
          <div class="custom-control custom-radio custom-control-inline">
            <input name="iterations" id="iterations_0" type="radio" required="required" class="custom-control-input" value="0"> 
            <label for="iterations_0" class="custom-control-label">0</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input name="iterations" id="iterations_1" type="radio" required="required" class="custom-control-input" value="1"> 
            <label for="iterations_1" class="custom-control-label">1</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input name="iterations" id="iterations_2" type="radio" required="required" class="custom-control-input" value="2" checked="checked"> 
            <label for="iterations_2" class="custom-control-label">2</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input name="iterations" id="iterations_3" type="radio" required="required" class="custom-control-input" value="3"> 
            <label for="iterations_3" class="custom-control-label">3</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input name="iterations" id="iterations_4" type="radio" required="required" class="custom-control-input" value="4"> 
            <label for="iterations_4" class="custom-control-label">4</label>
          </div>
        </div>
      </div>
      <div class="miningtype form-group row">
        <label for="miningtype" class="col-4 col-form-label">Mining Type</label> 
        <div class="col-8">
          <select id="miningtype" name="miningtype" class="custom-select" required="required">
            <option value="user">User > Followers & Medias</option>
            <option value="hashtagRecent">Hashtag Recent | Media > Users info</option>
            <option value="hashtagTop">Hashtag Top | Media > Users Info</option>
          </select>
        </div>
      </div>
      <div class="hashtagmediaamount form-group row">
        <label for="hashtagmediaamount" class="col-4 col-form-label">Hashtag Media Amount</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-sort-numeric-asc"></i>
              </div>
            </div> 
            <input id="hashtagmediaamount" name="hashtagmediaamount" placeholder="Number of media downloaded" type="text" class="form-control">
          </div>
        </div>
      </div> 
      <div class="form-group row">
        <div class="offset-4 col-8">
        <input type="submit" name="save_task" class="btn btn-success btn-block" value="Save Task">
        </div>
      </div>
    </form>'
    ;
}
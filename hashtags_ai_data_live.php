<?php
include("db.php");
$title = '';
$description= '';

/*
if (isset($_GET['nodeMinDegree'])) {
    $nodeMinDegree = $_GET['nodeMinDegree'];
} else {
    $nodeMinDegree = 0;
}
*/
$initialLayout = isset($_GET['initialLayout']) ? $_GET['initialLayout'] : "circlepack";
$autoGravityScale = isset($_GET['autoGravityScale']) ? $_GET['autoGravityScale'] : "auto";
$nodeMinDegree = isset($_GET['nodeMinDegree']) ? $_GET['nodeMinDegree'] : 0;
$gravity = isset($_GET['gravity']) ?  $_GET['gravity'] : 1;
$iterations = isset($_GET['iterations']) ? $_GET['iterations'] : 133;
$scale = isset($_GET['scale']) ? $_GET['scale'] : 5000;
$adjustSizes = isset($_GET['adjustSizes']) ? $_GET['adjustSizes'] : 'false';
$cleanEntities = isset($_GET['cleanEntities']) ? $_GET['cleanEntities'] : 'true';
$barnesHutOptimize = isset($_GET['barnesHutOptimize']) ? $_GET['barnesHutOptimize'] : 'false';
$barnesHutTheta = isset($_GET['barnesHutTheta']) ? $_GET['barnesHutTheta'] : 0.5;
$linLogMode = isset($_GET['linLogMode']) ? $_GET['linLogMode'] : 'false';
$outboundAttractionDistribution = isset($_GET['outboundAttractionDistribution']) ? $_GET['outboundAttractionDistribution'] : 'true';
$scalingRatio = isset($_GET['scalingRatio']) ? $_GET['scalingRatio'] : 1;
$slowDown = isset($_GET['slowDown']) ? $_GET['slowDown'] : 1;
$strongGravityMode = isset($_GET['strongGravityMode']) ? $_GET['strongGravityMode'] : 'false';
$networkfilter_get = isset($_GET['networkfilter']) ? $_GET['networkfilter'] : ["standard", "text_ai", "image_ai", "text_ai_entitites"];
$nodeFixedSize = isset($_GET['nodeFixedSize']) ? $_GET['nodeFixedSize'] : 'false';

$networkfilter_json = json_encode($networkfilter_get);

if  (isset($_GET['id'])) {
  $id = $_GET['id'];
  $query_tasks = "SELECT * FROM tasks WHERE id=$id";
  $result_tasks = mysqli_query($conn, $query_tasks);
  if (mysqli_num_rows($result_tasks) == 1) {
    $row_tasks = mysqli_fetch_array($result_tasks);
    $MUID = $row_tasks['MUID'];
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

?>
<?php include('includes/header.php'); ?>
<script>
    //from here https://stackoverflow.com/questions/55760121/html2canvas-captures-everything-except-the-content-of-an-inner-canvas
    HTMLCanvasElement.prototype.getContext = function(origFn) {
        return function(type, attribs) {
            attribs = attribs || {};
            attribs.preserveDrawingBuffer = true;
            return origFn.call(this, type, attribs);
        };
    }(HTMLCanvasElement.prototype.getContext);
</script>
<script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


<script src="/vista/includes/js-networks/graphology.js"></script>
<script src="/vista/includes/js-networks/graphology-library.js"></script>
<script src="/vista/includes/js-networks/sigma.js"></script>
<div class="container p-4">
    <div class="row">
        <div class="col-md-12">
            <div class="card card-body">
                <h3 id="MUID"><?php echo $MUID ?></h3>
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
                        </tr>
                    </thead>
                    <tbody style="display:none;">

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
                        </tr>
                        <?php }

             } else {
              echo "There is no MUID";
          }?>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="col-md-12">
            <div class="card card-body">
                <h3>Graphology.js ForceAtlas Layout</h3>
                <form method="GET" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                    <div class="form-group">
                        <label for="id">ID</label>
                        <input id="id" name="id" value="<?php echo $id?>" type="text" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Network will include:</label>
                        <div>
                            <div class="custom-controls-stacked">
                                <div class="custom-control custom-checkbox">
                                    <input name="networkfilter[]" id="networkfilter_0" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="standard" <?php if (in_array("standard", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>>
                                    <label for="networkfilter_0" class="custom-control-label">Standard</label>
                                </div>
                            </div>
                            <div class="custom-controls-stacked">
                                <div class="custom-control custom-checkbox">
                                    <input name="networkfilter[]" id="networkfilter_1" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="text_ai" <?php if (in_array("text_ai", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>>
                                    <label for="networkfilter_1" class="custom-control-label">Text_AI_Dict</label>
                                </div>
                            </div>
                            <div class="custom-controls-stacked">
                                <div class="custom-control custom-checkbox">
                                    <input name="networkfilter[]" id="networkfilter_3" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="text_ai_entitites" <?php if (in_array("text_ai_entitites", $networkfilter_get)) {
          echo 'checked="checked"';
        } ?>>
                                    <label for="networkfilter_3" class="custom-control-label">Text_AI_OOV</label>
                                </div>
                            </div>
                            <div class="custom-controls-stacked">
                                <div class="custom-control custom-checkbox">
                                    <input name="networkfilter[]" id="networkfilter_2" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="image_ai" <?php if (in_array("image_ai", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>>
                                    <label for="networkfilter_2" class="custom-control-label">Image_AI</label>
                                </div>
                            </div>
                            <span id="networkfilterHelpBlock" class="form-text text-muted">Select the data used to feed the graph. Standard [hashtags, posts, users]. Text_AI: Hashtags classificated by [Northamerica city list, Graffiti terms, Railroad terms] Image_AI: Post classificated by graffti types [tag, wildstyle, 3D, monikers, bomba (trowhup])]</span>
                        </div>
                    </div>
                    <div class="form-group">

                        <label for="nodeMinDegree">Node Minimum Degree</label>
                        <input id="nodeMinDegree" name="nodeMinDegree" value="<?php echo $nodeMinDegree ?>" type="text" aria-describedby="nodeMinDegreeHelpBlock" class="form-control">
                        <span id="nodeMinDegreeHelpBlock" class="form-text text-muted">Minimum entrance degree of node, smaller will be deleted form graph. Default will be 0</span>
                    </div>

                    <div class="form-group row">
                        <label class="col-6">Should we clean not related <b>text_ai_entitites</b> to term <b>"graffiti"</b>, numbers only and non latin chars?</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="cleanEntities" id="cleanEntities_0" type="radio" class="custom-control-input" value="true" <?php echo $cleanEntities == 'true' ? 'checked':'' ; ?>>
                                <label for="cleanEntities_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="cleanEntities" id="cleanEntities_1" type="radio" class="custom-control-input" value="false" <?php echo $cleanEntities == 'false' ? 'checked':'' ; ?>>
                                <label for="cleanEntities_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="gravity">Gravity</label>
                        <input id="gravity" name="gravity" value="<?php echo $gravity ?>" type="text" class="form-control">
                    </div>
                    <div class="form-group row">
                        <label class="col-6">Should the node’s sizes be taken into account?</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="adjustSizes" id="adjustSizes_0" type="radio" class="custom-control-input" value="true" <?php echo $adjustSizes == 'true' ? 'checked':'' ; ?>>
                                <label for="adjustSizes_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="adjustSizes" id="adjustSizes_1" type="radio" class="custom-control-input" value="false" <?php echo $adjustSizes == 'false' ? 'checked':'' ; ?>>
                                <label for="adjustSizes_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">Use the Barnes-Hut approximation to compute repulsion in O(n*log(n)) rather than default O(n^2), n being the number of nodes.</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="barnesHutOptimize" id="barnesHutOptimize_0" type="radio" class="custom-control-input" value="true" <?php echo $barnesHutOptimize == 'true' ? 'checked':'' ; ?>>
                                <label for="barnesHutOptimize_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="barnesHutOptimize" id="barnesHutOptimize_1" type="radio" class="custom-control-input" value="false" <?php echo $barnesHutOptimize == 'false' ? 'checked':'' ; ?>>
                                <label for="barnesHutOptimize_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="barnesHutTheta" class="col-6 col-form-label">Barnes-Hut approximation theta parameter</label>
                        <div class="col-6">
                            <input id="barnesHutTheta" name="barnesHutTheta" type="text" class="form-control" value="<?php echo $barnesHutTheta; ?>">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">outboundAttractionDistribution</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="outboundAttractionDistribution" id="outboundAttractionDistribution_0" type="radio" class="custom-control-input" value="true" <?php echo $outboundAttractionDistribution == 'true' ? 'checked':'' ; ?>>
                                <label for="outboundAttractionDistribution_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="outboundAttractionDistribution" id="outboundAttractionDistribution_1" type="radio" class="custom-control-input" value="false" <?php echo $outboundAttractionDistribution == 'false' ? 'checked':'' ; ?>>
                                <label for="outboundAttractionDistribution_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">Use Noack’s LinLog model?</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="linLogMode" id="linLogMode_0" type="radio" class="custom-control-input" value="true" <?php echo $linLogMode == 'true' ? 'checked':'' ; ?>>
                                <label for="linLogMode_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="linLogMode" id="linLogMode_1" type="radio" class="custom-control-input" value="false" <?php echo $linLogMode == 'false' ? 'checked':'' ; ?>>
                                <label for="linLogMode_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="scalingRatio" class="col-6 col-form-label">scalingRatio</label>
                        <div class="col-6">
                            <input id="scalingRatio" name="scalingRatio" type="text" class="form-control" value="<?php echo $scalingRatio; ?>">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="slowDown" class="col-6 col-form-label">slowDown</label>
                        <div class="col-6">
                            <input id="slowDown" name="slowDown" type="text" class="form-control" value="<?php echo $slowDown; ?>">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">strongGravityMode</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="strongGravityMode" id="strongGravityMode_0" type="radio" class="custom-control-input" value="true" <?php echo $strongGravityMode == 'true' ? 'checked':'' ; ?>>
                                <label for="strongGravityMode_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="strongGravityMode" id="strongGravityMode_1" type="radio" class="custom-control-input" value="false" <?php echo $strongGravityMode == 'false' ? 'checked':'' ; ?>>
                                <label for="strongGravityMode_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">nodeFixedSize</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="nodeFixedSize" id="nodeFixedSize_0" type="radio" class="custom-control-input" value="true" <?php echo $nodeFixedSize == 'true' ? 'checked':'' ; ?>>
                                <label for="nodeFixedSize_0" class="custom-control-label">true</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="nodeFixedSize" id="nodeFixedSize_1" type="radio" class="custom-control-input" value="false" <?php echo $nodeFixedSize == 'false' ? 'checked':'' ; ?>>
                                <label for="nodeFixedSize_1" class="custom-control-label">false</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">initialLayout</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="initialLayout" id="initialLayout_0" type="radio" class="custom-control-input" value="random" <?php echo $initialLayout == 'random' ? 'checked':'' ; ?>>
                                <label for="initialLayout_0" class="custom-control-label">random</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="initialLayout" id="initialLayout_1" type="radio" class="custom-control-input" value="circlepack" <?php echo $initialLayout == 'circlepack' ? 'checked':'' ; ?>>
                                <label for="initialLayout_1" class="custom-control-label">circlepack</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-6">autoGravityScale</label>
                        <div class="col-6">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="autoGravityScale" id="autoGravityScale_0" type="radio" class="custom-control-input" value="auto" <?php echo $autoGravityScale == 'auto' ? 'checked':'' ; ?>>
                                <label for="autoGravityScale_0" class="custom-control-label">auto</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input name="autoGravityScale" id="autoGravityScale_1" type="radio" class="custom-control-input" value="manual" <?php echo $autoGravityScale == 'manual' ? 'checked':'' ; ?>>
                                <label for="autoGravityScale_1" class="custom-control-label">manual</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button name="submit" type="submit" class="btn btn-primary">Build graph</button>
                    </div>
                </form>
            </div>
        </div>

    </div>


    <div class="row">
        <div class="col-md-12">
            <div class="card card-body">
                <h4>Network Graph</h4>
                <div id="sigma-logs">
                    <div class="hoverBox hashtag">
                    </div>
                    <div class="hover stats">
                        <div class="graph">
                            <h6>Graph Stats</h6>
                            <ul>
                                <li class="totalNodes">Total nodes: <span>-</span> </li>
                                <li class="totalEdges">Total edges: <span>-</span> </li>
                                <li class="droppedNodes">Dropped nodes: <span>-</span> </li>
                                <li class="afterDropNodes">Nodes after drop: <span>-</span> </li>
                                <li class="afterDropEdges">Edges after drop: <span>-</span> </li>
                                <li class="density">Density: <span>-</span> </li>
                                <li class="simpleSize">Simple size: <span>-</span> </li>
                                <li class="weightedSize">Weighted size: <span>-</span> </li>
                            </ul>
                        </div>
                        <div class="history">
                            <h6>Click History: <a class="deleteHistory" href="">Delete</a></h6>
                            <ul class="nodeHistory">
                            </ul>
                        </div>
                        <div class="node">
                            <h6>Node Stats</h6>
                            <ul>
                                <li class="singleNodes">Nodes clicked: <span>-</span> </li>
                                <li class="neighborsCount">Neighbors of node: <span>-</span> </li>
                            </ul>
                        </div>
                    </div>

                    <div class="hover conf">
                        <form id="rendered-form">
                            <div class="rendered-form">
                                <div class="formbuilder-radio-group form-group field-nodeReducerDepth">
                                    <label for="nodeReducerDepth" class="formbuilder-radio-group-label">nodeReducerDepth
                                        <span class="formbuilder-required">*</span></label>
                                    <div class="radio-group">
                                        <div class="formbuilder-radio">
                                            <input name="nodeReducerDepth" id="nodeReducerDepth-0" required="required" aria-required="true" value="selectedNeighbors" type="radio" checked="checked"><label for="nodeReducerDepth-0">selectedNeighbors</label>
                                        </div>
                                        <div class="formbuilder-radio"><input name="nodeReducerDepth" id="nodeReducerDepth-1" required="required" aria-required="true" value="selectedNeighborsNeighbors" type="radio"><label for="nodeReducerDepth-1">selectedNeighborsNeighbors</label></div>
                                    </div>
                                </div>
                                <div class="formbuilder-checkbox-group form-group field-statsVis">
                                    <label for="statsVis" class="formbuilder-checkbox-group-label">statsVis</label>
                                    <div class="checkbox-group">
                                        <div class="formbuilder-checkbox">
                                            <input name="statsVis[]" id="statsVis-0" value="graph" type="checkbox" checked="checked">
                                            <label for="statsVis-0">graph</label>
                                        </div>
                                        <div class="formbuilder-checkbox">
                                            <input name="statsVis[]" id="statsVis-1" value="node" type="checkbox" checked="checked">
                                            <label for="statsVis-1">node</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="formbuilder-radio-group form-group field-mediaVis">
                                    <label for="mediaVis" class="formbuilder-radio-group-label">mediaVis</label>
                                    <div class="radio-group">
                                        <div class="formbuilder-radio">
                                            <input name="mediaVis" id="mediaVis-0" value="true" type="radio" checked="checked">
                                            <label for="mediaVis-0">true</label>
                                        </div>
                                        <div class="formbuilder-radio">
                                            <input name="mediaVis" id="mediaVis-1" value="false" type="radio">
                                            <label for="mediaVis-1">false</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
                <div id="mountNode" style="
                height: 800px;
                width: 100%;">
                </div>

            </div>
            <div class="card card-body">
                <form>
                    <div class="form-group">
                        <div>
                            <button name="start" type="button" id="start" class="btn btn-primary">Start</button>
                            <button name="stop" type="button" id="stop" class="btn btn-primary">Stop</button>
                            <button name="screenshot" type="button" id="screenshot" class="btn btn-primary">Screenshot</button>
                            <button name="fixedsize" type="button" id="fixedsize" class="btn btn-primary">initial size & colors</button>
                            <button name="cleanNonInferenced" type="button" id="cleanNonInferenced" class="btn btn-primary">drop not inferenced</button>
                            <button name="deletePostHashtags" type="button" id="deletePostHashtags" class="btn btn-primary">deletePostHashtags</button>
                        </div>
                        <div>
                            <button name="computecentrality" type="button" id="computecentrality" class="btn btn-primary">Compute centrality stats</button>
                            <label>(betweenness, closeness, degree, eigenvector [not working with big networks], pagerank)</label>
                            <br>
                            <button name="betweennesssizecentrality" type="button" id="betweennesssizecentrality" class="btn btn-primary">betweenness centrality</button>
                            <button name="closenessizecentrality" type="button" id="closenessizecentrality" class="btn btn-primary">closeness centrality</button>
                            <button name="degreesizecentrality" type="button" id="degreesizecentrality" class="btn btn-primary">degree centrality</button>
                            <button name="pageranksizecentrality" type="button" id="pageranksizecentrality" class="btn btn-primary">pageranksizecentrality</button>
                        </div>
                        <div>
                            <button name="computelouvain" type="button" id="computelouvain" class="btn btn-primary">Compute louvain stats</button>
                            <label>(louvain)</label>
                            <button name="colorlouvain" type="button" id="colorlouvain" class="btn btn-primary">Color louvain stats</button>
                            <label>(just after computelouvain it's executed)</label>

                            <button name="countnodeType" type="button" id="countnodeType" class="btn btn-primary">countnodeType</button>
                            <label>Response @ console.log</label>
                            <button name="countnodeTypeState" type="button" id="countnodeTypeState" class="btn btn-primary">countnodeTypeState</button>
                            <label>Response @ console.log</label>
                            <button name="contarNodosConUsuariosVinculados" type="button" id="contarNodosConUsuariosVinculados" class="btn btn-primary">contarNodosConUsuariosVinculados</button>
                            <label>Response @ console.log</label>

                        </div>
                    </div>
                </form>
                <div id="resultados"></div>
                <div id="resultados2"></div>
                <div id="resultados3"></div>
            </div>
        </div>
    </div>
</div>

<script>
    //variables from form
    const graph = new graphology.MultiGraph();
    const container = document.getElementById("mountNode");
    var MUID = <? echo "'$MUID'" ?> ;
    var nodeMinDegree = <? echo $nodeMinDegree ?> ;
    var gravity = <? echo $gravity ?> ;
    var iterations = <? echo $iterations ?> ;
    var scale = <? echo $scale ?> ;
    var adjustSizes = <? echo $adjustSizes ?> ;
    var cleanEntities = <? echo $cleanEntities ?> ;
    var barnesHutOptimize = <? echo $barnesHutOptimize ?> ;
    var barnesHutTheta = <? echo $barnesHutTheta ?> ;
    var linLogMode = <? echo $linLogMode ?> ;
    var outboundAttractionDistribution = <? echo $outboundAttractionDistribution ?> ;
    var scalingRatio = <? echo $scalingRatio ?> ;
    var slowDown = <? echo $slowDown ?> ;
    var strongGravityMode = <? echo $strongGravityMode ?> ;
    var nodeFixedSize = <? echo $nodeFixedSize ?> ;
    var initialLayout = <? echo "'$initialLayout'" ?> ;
    var autoGravityScale = <? echo "'$autoGravityScale'" ?> ;


    var networkfilter = <? echo $networkfilter_json ?> ;

    //alert(networkfilter);

    // Replace ./data.json with your JSON feed
    let com0 = "#556270";
    let com1 = "#4ECDC4";
    let com2 = "#C7F464";
    let com3 = "#FF6B6B";
    let com4 = "#FFA500";
    let com5 = "#F7CD80";
    let com6 = "#EAD7B5";
    let com7 = "#982AA5";
    let com8 = "#CD3E00";
    let com9 = "#C86D10";
    let com10 = "#A52A2A";

    //funcion para quitar not ascii

    var latinText = function (text) {
        var regex = /([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+)/g;
        var regex2 = /([^\x00-\x7F]+)/;
        //console.log( !text.match(regex2) );
        return !text.match( regex2 );
        //return text.match(regex);
    };

  var onlyNumbers = function (text) {
      var regex = /^-?\d*\.?\d*$/;
      return !text.match (regex);
  }
  // Inicializa variables para el número mayor y menor
  let maxLikes = Number.MIN_SAFE_INTEGER;
  let minLikes = Number.MAX_SAFE_INTEGER;
  let maxNoPublications = Number.MIN_SAFE_INTEGER;
  let minNoPublications = Number.MAX_SAFE_INTEGER;
  let maxFollowers = Number.MIN_SAFE_INTEGER;
  let minFollowers = Number.MAX_SAFE_INTEGER;

  // Función para normalizar un valor dado en un rango específico
function normalize(value, min, max, newMin, newMax) {
    return (value - min) / (max - min) * (newMax - newMin) + newMin;
}

    fetch('https://data.abundis.com.mx/vista/json_actions/json_scandir_ai.php?MUID=' + MUID).then(response => {
        return response.json();
    }).then(data => {
        //Todo el recorrido
        console.log(data);


        Object.entries(data).forEach(function([key, item]) {
            console.log(item);
            //Hacer funcion
            fetch('./json/ai/' + item).then(response => {
                return response.json();
            }).then(data => {
                //pide data
                console.log(data);
                Object.entries(data['nodes']).forEach(function([key, item]) {
                    item['id'] = item['id'].toLowerCase();
                    //da de alta nodos
                    if (key = 'nodes') {
                        //console.log(item['id']);
                        if (graph.hasNode(item['id'])) {
                            //console.log("Ya existe");
                        } else {
                            //console.log("Agregar");
                            if (item['type'] == "post") {
                              // Actualiza valores máximos y mínimos para 'likes'
                               maxLikes = Math.max(maxLikes, item['likes']);
                               minLikes = Math.min(minLikes, item['likes']);
                                graph.addNode(item['id'], {
                                    label: item['label'],
                                    nodetype: item['type'],
                                    likes: item['likes'],
                                    comments: item['comments'],
                                    product_type: item['product_type']
                                });
                            } else if (item['type'] == "hashtag") {
                                  // Actualiza valores máximos y mínimos para 'no_publications'

                                  if (!isNaN(item['no_publications'])) {
                           maxNoPublications = Math.max(maxNoPublications, item['no_publications']);
                           minNoPublications = Math.min(minNoPublications, item['no_publications']);
                       }

                            console.log(item);
                            console.log (maxNoPublications);
                            console.log (minNoPublications);
                                graph.addNode(item['id'], {
                                    label: item['label'],
                                    nodetype: item['type'],
                                    no_publications: item['no_publications']
                                });
                              } else if (item['type'] == "user") {
                                // Actualiza valores máximos y mínimos para 'followers'
                                 maxFollowers = Math.max(maxFollowers, item['follower']);
                                 minFollowers = Math.min(minFollowers, item['follower']);
                                 console.log(item);
                                 console.log (maxFollowers);
                                 console.log (minFollowers);

                                  graph.addNode(item['id'], {
                                      label: item['label'],
                                      nodetype: item['type'],
                                      followers: item['follower'],
                                      following: item['following'],
                                      private: item['private'],
                                  });
                              } else {
                                graph.addNode(item['id'], {
                                    label: item['label'],
                                    nodetype: item['type']
                                });
                            }

                        }
                    }
                });
                Object.entries(data['edges']).forEach(function([key, item]) {
                    item['source'] = item['source'].toLowerCase();
                    item['target'] = item['target'].toLowerCase();
                    if (key = 'edges') {
                        if (graph.hasEdge(item['source'], item['target'])) {
                            //console.log("edge existia");
                        } else {
                            if (graph.hasNode(item['target']) && graph.hasNode(item['source'])) {
                                graph.addEdge(item['source'], item['target']);
                                graph.addEdge(item['target'], item['source']);
                            } else {
                                console.log("no existia nodo target");
                                //graph.addNode(item['target'], {label: item['target']});
                                //graph.addEdge(item['source'], item['target'])
                            }
                        }
                    }
                });
                // Imprime los valores máximos y mínimos
                console.log('Max Likes:', maxLikes);
                console.log('Min Likes:', minLikes);
                console.log('Max No Publications:', maxNoPublications);
                console.log('Min No Publications:', minNoPublications);
                console.log('Max Followers:', maxFollowers);
                console.log('Min Followers:', minFollowers);

            })
            .then(function() {
                console.log('Number of nodes before drops', graph.order);
                console.log('Number of edges before drops', graph.size);
                $(".totalNodes > span").replaceWith("<span> " + graph.order + "</span>");
                $(".totalEdges > span").replaceWith("<span> " + graph.size + "</span>");

                let drop_cont = 0;
                graph.nodes().forEach((node, i) => {
                    var nodetype = graph.getNodeAttributes(node)['nodetype']
                    //console.log(graph.degree(node));
                    if (graph.degree(node) <= nodeMinDegree) {
                        drop_cont++;
                        graph.dropNode(node);
                        //console.log(drop_cont);
                    } else {
                      //setNodeSize(node, nodetype, drop_cont);

                    }
                    if (cleanEntities == true) {
                      //console.log (latinText(node));
                      if( !latinText(node) && graph.hasNode(node) ){
                          //console.log("drop: "+node);
                          graph.dropNode(node);
                          drop_cont++;
                        }

                      if( !onlyNumbers(node) && graph.hasNode(node) ){
                          //console.log("drop: "+node);
                          graph.dropNode(node);
                          drop_cont++;
                        }

                        if (nodetype == "entity_individual" && graph.hasNode(node) ) {
                            //console.log("inicia entidades");
                            //console.log(node);
                            var entity_attr = graph.getNodeAttributes(node);

                            var hashtag_entity_posts_neighbors_list = []
                            //console.log(entity_attr);
                            graph.forEachNeighbor(node, function(hashtag_entity, attributes) {
                                if (attributes['nodetype'] == "hashtag") {
                                  //console.log("hashtag neighbor");
                                  //console.log(neighbor, attributes);
                                  graph.forEachNeighbor(hashtag_entity, function(hashtag_entity_posts, attributes_posts) {
                                      if (attributes_posts['nodetype'] == "post") {
                                        //console.log(hashtag_entity_posts, attributes_posts);
                                        //console.log("hashtag entity posts");
                                        graph.forEachNeighbor(hashtag_entity_posts, function(hashtag_entity_posts_neighbors, neighbors_attributes_posts) {
                                            if (neighbors_attributes_posts['nodetype'] == "hashtag") {
                                              //console.log(hashtag_entity_posts_neighbors, neighbors_attributes_posts);
                                              hashtag_entity_posts_neighbors_list.push(neighbors_attributes_posts['label']);
                                            }
                                          });


                                      }
                                    });

                                }
                              });
                            //console.log(hashtag_entity_posts_neighbors_list)
                            //console.log(hashtag_entity_posts_neighbors_list.includes("graffiti"));
                              if(hashtag_entity_posts_neighbors_list.includes("graffiti") == false){
                                //console.log("se va a borrar")
                                //console.log("drop: "+node)
                                graph.dropNode(node);
                                drop_cont++;
                              }
                        }

                          }
                });
                /*)
                alert("nodeMinDegree: " + nodeMinDegree + "\n" +
                		"scale: " + scale + "\n" +
                		"iterations: " + iterations + "\n" +
                		"attraction: " + attraction + "\n" +
                		"repulsion: " + repulsion + "\n" +
                		"gravity: " + gravity + "\n" +
                		"inertia: " + inertia + "\n" +
                		"maxMove: " + maxMove
                		)
                		*/

                /*
                Density
                Diameter
                Extent
                Modularity
                Simple size
                Weighted size
                */
                console.log("droped nodes: " + drop_cont)
                $(".droppedNodes > span").replaceWith("<span> " + drop_cont + "</span>");

            }).then(function() {
                console.log("ultima");

                console.log("order: " + graph.order);
                console.log("size: " + graph.size);
                console.log("density: " + graphologyLibrary.metrics.graph.density(graph));
                console.log("simpleSize: " + graphologyLibrary.metrics.graph.simpleSize(graph));
                console.log("weightedSize: " + graphologyLibrary.metrics.graph.weightedSize(graph));
                console.log("diameter: " + graphologyLibrary.metrics.graph.diameter(graph));

                $(".afterDropNodes > span").replaceWith("<span> " + graph.order + "</span>");
                $(".afterDropEdges > span").replaceWith("<span> " + graph.size + "</span>");
                $(".density > span").replaceWith("<span> " + graphologyLibrary.metrics.graph.density(graph) + "</span>");
                $(".simpleSize > span").replaceWith("<span> " + graphologyLibrary.metrics.graph.simpleSize(graph) + "</span>");
                $(".weightedSize > span").replaceWith("<span> " + graphologyLibrary.metrics.graph.weightedSize(graph) + "</span>");

                let drop_cont = 0;
                graph.nodes().forEach((node, i) => {
                    var nodetype = graph.getNodeAttributes(node)['nodetype']

                      setNodeSize(node, nodetype, drop_cont);

                    });


                if (initialLayout == "random") {
                    graphologyLibrary.layout.random.assign(graph);
                } else if (initialLayout == "circlepack") {
                    graphologyLibrary.layout.circlepack.assign(graph);
                }

                if (autoGravityScale == "auto") {
                    gravity = graph.order;
                    scalingRatio = graph.size;
                    $( "#gravity" ).prop( "disabled", true );
                    $( "#scalingRatio" ).prop( "disabled", true );
                } else if (autoGravityScale == "manual") {

                }

                console.log(scalingRatio);
                console.log(gravity);


                /*
                graphologyLibrary.layoutForceAtlas2.assign(graph, {
                  iterations: iterations,
                  settings: {
                      attraction: attraction,
                      repulsion: repulsion,
                      gravity: gravity,
                      inertia: inertia,
                      maxMove: maxMove,

                  }
                })
                          */



                const layout = new graphologyLibrary.FA2Layout(graph, {
                    iterations: iterations,
                    //getEdgeWeight: 'weight',
                    settings: {
                        gravity: gravity,
                        adjustSizes: adjustSizes,
                        barnesHutOptimize: barnesHutOptimize,
                        barnesHutTheta: barnesHutTheta,
                        //edgeWeightInfluence: 1,
                        linLogMode: linLogMode,
                        outboundAttractionDistribution: outboundAttractionDistribution,
                        scalingRatio: scalingRatio,
                        slowDown: slowDown,
                        strongGravityMode: strongGravityMode,
                    }
                })

                $("#start").click(function() {
                    layout.start();
                });

                $("#stop").click(function() {
                    layout.stop();
                });


            });

            //fin
        });

    }).catch(err => {
        console.log(err);
    });

    const renderer = new Sigma(graph, container, {
        // We don't have to declare edgeProgramClasses here, because we only use the default ones ("line" and "arrow")
        //renderEdgeLabels: false,
        //allowInvalidContainer: false,
        //enableEdgeClickEvents: true,
        //enableEdgeWheelEvents: true,
        //enableEdgeHoverEvents: "debounce",
      renderLabels: false,
        //defaultEdgeColor: "red",
    });

    const state = {};

    renderer.on("clickNode", ({
        node
    }) => {
        state.selectedNode = node;
        state.selectedNeighbors = new Set(graph.neighbors(node));
        state.selectedNeighborsNeighbors = new Set();
        graph.neighbors(node).forEach(function(el) {
            graph.neighbors(el).forEach(item => state.selectedNeighborsNeighbors.add(item))
        });

        console.log("Building neighbors");
        console.log("selectedNeighbors");
        console.log(state.selectedNeighbors);
        console.log("selectedNeighborsNeighbors")
        console.log(state.selectedNeighborsNeighbors)
        hashtagFetchInfo(node);
        nodeStats(node);
        clickedNodeHistory(node)
        renderer.refresh();
    });

    renderer.on("clickStage", () => {
        state.selectedNode = undefined;
        state.selectedNeighbors = undefined;
        state.selectedNeighborsNeighbors = undefined;
        state.selectedNode = undefined;
        jQuery(".hoverBox").hide("slow");
        renderer.refresh();
    });
    renderer.setSetting("nodeReducer", (node, data) => {
        const res = {
            ...data
        };
        if (
            state.selectedNeighborsNeighbors &&
            state.selectedNeighborsNeighbors.has(node) &&
            state.selectedNeighbors &&
            !state.selectedNeighbors.has(node) &&
            state.selectedNode !== node
        ) {
            if ($('#nodeReducerDepth-0').is(':checked')) {
                //dependiendo se se quiere mostrar la red completa o no, se esconden los nodos
                res.label = "";
                res.color = "#f6f6f6";
                res.hidden = true;
            }
        } else if (
            state.selectedNeighbors &&
            !state.selectedNeighbors.has(node) &&
            state.selectedNode !== node
        ) {
            res.label = "";
            res.color = "#f6f6f6";
            res.hidden = true;
        }
        if (state.selectedNode === node) {
            res.highlighted = true;
            //res.color = "#FF6B6B";
        }
        return res;
    });

    // se puede agregar una opción para quitar los
    //  renderer.setSetting("edgeReducer", (node, data) => {
    //    const res = { ...data };
    //    if (state.selectedNode && !graph.hasExtremity(node, state.selectedNode)) {
    //      res.hidden = true;
    //    }
    //    return res;
    //  });

    renderer.refresh();

    function nodeOutsideRenderer(node, nodetype) {

        state.selectedNode = node;
        state.selectedNeighbors = new Set(graph.neighbors(node));
        state.selectedNeighborsNeighbors = new Set();
        graph.neighbors(node).forEach(function(el) {
            graph.neighbors(el).forEach(item => state.selectedNeighborsNeighbors.add(item))
        });

        //console.log("Building neighbors");
        //console.log("selectedNeighbors");
        //console.log(state.selectedNeighbors);
        //console.log("selectedNeighborsNeighbors")
        //console.log(state.selectedNeighborsNeighbors)
        hashtagFetchInfo(node);
        nodeStats(node);
        clickedNodeHistory(node)
        renderer.refresh();
    }

    function nodeStats(node) {
        neighbors = graph.neighbors(node)
        console.log(neighbors)
        $(".singleNodes > span").replaceWith("<span> " + node + "</span>");
        //$(".singleNodes > span").replaceWith("<span> " + graph.neighbors( node ).lenght() + "</span>");
        $(".neighborsCount > span").replaceWith("<span> " + neighbors.length + "</span>");
        $(".neighborsCount > ul.neighborsList").remove();
        $("<ul class='neighborsList'></ul>").appendTo(".neighborsCount");
        for (neighborSingle of neighbors) { // You can use `let` instead of `const` if you like
            neighborSingleAttr = graph.getNodeAttributes(neighborSingle);
            console.log()
            $("<li class='nodeInfo' nodeReal='" + neighborSingle + "' nodeLabel='" + neighborSingleAttr.label + "' nodeType='" + neighborSingleAttr.nodetype + "'>" + neighborSingleAttr.label + " - " + neighborSingleAttr.nodetype + "</>").appendTo(".neighborsList");
            console.log(neighborSingleAttr)
        }
    }

    function clickedNodeHistory(node) {
        neighborSingleAttr = graph.getNodeAttributes(node);
        $(".nodeHistory").prepend("<li class='nodeInfo' nodeReal='" + node + "' nodeLabel='" + neighborSingleAttr.label + "' nodeType='" + neighborSingleAttr.nodetype + "'>" + neighborSingleAttr.label + " - " + neighborSingleAttr.nodetype + "</>");
    }

    function hashtagFetchInfo(node) {
        console.log(graph.getNodeAttributes(node)['nodetype']);
        console.log(node);
        console.log(graph.getNodeAttributes(node)['label']);
        var nodeType = graph.getNodeAttributes(node)['nodetype']

          if (graph.getNodeAttributes(node)['nodetype'] == 'hashtag' || graph.getNodeAttributes(node)['nodetype'] == 'ai_text_hashtag'){
            var settings = {
                "url": "json_data.php",
                "method": "GET",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "node": graph.getNodeAttributes(node)['label'],
                    "nodeType": graph.getNodeAttributes(node)['nodetype'],
                    "MUID": MUID
                }
            }
          }
          else if (graph.getNodeAttributes(node)['nodetype'] == 'post') {
            var settings = {
                "url": "json_data.php",
                "method": "GET",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "node": node,
                    "nodeType": graph.getNodeAttributes(node)['nodetype'],
                    "MUID": MUID
                }
            }
          }

        $.ajax(settings).done(function(response) {
            if (graph.getNodeAttributes(node)['nodetype'] == 'hashtag' || graph.getNodeAttributes(node)['nodetype'] == 'ai_text_hashtag') {
                    console.log("Hashtag has post in DB");
                    console.log(response);


                    jQuery(".hoverBox").empty();
                    jQuery("<h5>Hashtag: <b><a target='_blank' href='https://www.instagram.com/explore/tags/" + response['hashtag_info']['node'] + "'>" + response['hashtag_info']['node'] + "</a></b></h5>").appendTo(".hoverBox");
                    jQuery("<h6>Amount: <b>" + response['hashtag_info']['no_publications'] + "</b></h6>").appendTo(".hoverBox");
                    jQuery("<h6>Mined at: <b>" + response['hashtag_info']['mined_at'] + "</b></h6>").appendTo(".hoverBox");

                    console.log(response['post']);
                    var postObj = response['post'];
                    for (const key in postObj) {
                        if (postObj.hasOwnProperty(key)) {
                            //alert(postObj[key].user_id);
                            var url_ml_jpg = "http://data.abundis.com.mx/media//exported_images/" + MUID + "/" + postObj[key].m_id + "_exported.jpg";
                            var url_ml_webp = "http://data.abundis.com.mx/media/exported_images/" + MUID + "/" + postObj[key].m_id + "_exported.webp";

                            jQuery("<img src='" + url_ml_jpg + "' onerror=\"this.style.display='none'\"/>").appendTo(".hoverBox");
                            jQuery("<img src='" + url_ml_webp + "' onerror=\"this.style.display='none'\"/>").appendTo(".hoverBox");

                            jQuery("<ul>").appendTo(".hoverBox");
                            jQuery("<li>User: " + postObj[key].user_id + "</li>").appendTo(".hoverBox");
                            jQuery("<li>Posted @: " + postObj[key].taken_at + "</li>").appendTo(".hoverBox");
                            jQuery("<li>Comments: " + postObj[key].comment_count + "</li>").appendTo(".hoverBox");
                            jQuery("<li>Likes: " + postObj[key].like_count + "</li>").appendTo(".hoverBox");
                            //jQuery( "<li>Media:"+postObj[key].media+"</li>" ).appendTo( ".hoverBox" );
                            jQuery("<li>Hashtags:" + postObj[key].hashtags_used + "</li>").appendTo(".hoverBox");
                            jQuery("</ul>").appendTo(".hoverBox");
                        }
                    }
                    if (jQuery('#mediaVis-0').is(':checked')) {
                        jQuery(".hoverBox").show("slow");
                    } else {
                        jQuery(".hoverBox").hide();
                    }

            }
            else if (graph.getNodeAttributes(node)['nodetype'] == 'post') {
                console.log("Post in DB");
                console.log(response);

                jQuery(".hoverBox").empty();
                /*
            jQuery( "<h5>Post: <b><a target='_blank' href='https://www.instagram.com/explore/tags/"+response['hashtag_info']['node']+"'>"+response['hashtag_info']['node']+"</a></b></h5>" ).appendTo( ".hoverBox" );
            jQuery( "<h6>Amount: <b>"+response['hashtag_info']['no_publications']+"</b></h6>" ).appendTo( ".hoverBox" );
            */

                console.log(response['post']);
                var postObj = response['post'];

                var lastKey = Object.keys(postObj).sort().reverse()[0];
                var lastValue = postObj[lastKey];
                console.log(lastValue);
                console.log(response['post'][1]);

                jQuery("<h5>Image from ML inference (if available)</h5>").appendTo(".hoverBox");

                var url_ml_jpg = "http://data.abundis.com.mx/media//exported_images/" + MUID + "/" + response['post'][1].m_id + "_exported.jpg";
                var url_ml_webp = "http://data.abundis.com.mx/media/exported_images/" + MUID + "/" + response['post'][1].m_id + "_exported.webp";

                jQuery("<img src='" + url_ml_jpg + "' onerror=\"this.style.display='none'\"/>").appendTo(".hoverBox");
                jQuery("<img src='" + url_ml_webp + "' onerror=\"this.style.display='none'\"/>").appendTo(".hoverBox");

                jQuery("<h5>Post data</h5>").appendTo(".hoverBox");
                jQuery("<ul>").appendTo(".hoverBox");
                jQuery("<li>User: " + lastValue.user_id + "</li>").appendTo(".hoverBox");
                jQuery("<li>Posted @: " + lastValue.taken_at + "</li>").appendTo(".hoverBox");
                jQuery("<li>Comments: " + lastValue.comment_count + "</li>").appendTo(".hoverBox");
                jQuery("<li>Likes: " + lastValue.like_count + "</li>").appendTo(".hoverBox");
                jQuery("<li>Media type:" + lastValue.product_type + "</li>").appendTo(".hoverBox");
                jQuery("<li>Hashtags:" + lastValue.hashtags_used + "</li>").appendTo(".hoverBox");
                jQuery("<li>Text inference:" + lastValue.hashtag_detection + "</li>").appendTo(".hoverBox");
                jQuery("<li>Image inference:" + lastValue.inference_custom + "</li>").appendTo(".hoverBox");
                jQuery("</ul>").appendTo(".hoverBox");

                jQuery("<h5>Post mined from hashtag</h5>").appendTo(".hoverBox");
                jQuery("<ul>").appendTo(".hoverBox");
                /*
                for (const key in postObj) {
                    if (postObj.hasOwnProperty(key)) {
                        jQuery( "<li>"+postObj[key].hashtag_origin+"</li>" ).appendTo( ".hoverBox" );
        var url_jpg = "http://data.abundis.com.mx/media/" + response['post'][1].hashtag_origin + "/" + response['post'][1].user_id+"_" + response['post'][1].pk + ".jpg";
        var url_webp = "http://data.abundis.com.mx/media/" + response['post'][1].hashtag_origin + "/" + response['post'][1].user_id+"_" + response['post'][1].pk + ".webp";
        jQuery( "<img src='" + url_jpg + "' onerror=\"this.style.display='none'\"/>" ).appendTo( ".hoverBox" );
        jQuery( "<img src='" + url_webp + "' onerror=\"this.style.display='none'\"/>" ).appendTo( ".hoverBox" );
                    }
                }
                */
                jQuery("</ul>").appendTo(".hoverBox");
                if (jQuery('#mediaVis-0').is(':checked')) {
                    jQuery(".hoverBox").show("slow");
                } else {
                    jQuery(".hoverBox").hide();
                }

            }
        });

    }

    function postFetchInfo(node) {
        console.log(graph.getNodeAttributes(node)['nodetype']);
        console.log(node);
        var nodeType = graph.getNodeAttributes(node)['nodetype']
        var settings = {
            "url": "json_post_data.php",
            "method": "GET",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "node": node,
                "nodeType": graph.getNodeAttributes(node)['nodetype'],
                "MUID": MUID
            }
        }

        $.ajax(settings).done(function(response) {
            if (graph.getNodeAttributes(node)['nodetype'] == 'hashtag') {
                console.log("HOLA BABOCHON")
            }
            jQuery(".hoverBox").empty();
            jQuery("<h5>Hashtag: <b><a target='_blank' href='https://www.instagram.com/explore/tags/" + response['hashtag_info']['node'] + "'>" + response['hashtag_info']['node'] + "</a></b></h5>").appendTo(".hoverBox");
            jQuery("<h6>Amount: <b>" + response['hashtag_info']['no_publications'] + "</b></h6>").appendTo(".hoverBox");

            console.log(response['post']);
            var postObj = response['post'];
            for (const key in postObj) {
                if (postObj.hasOwnProperty(key)) {
                    //alert(postObj[key].user_id);
                    jQuery("<ul>").appendTo(".hoverBox");
                    jQuery("<li>User: " + postObj[key].user_id + "</li>").appendTo(".hoverBox");
                    jQuery("<li>Posted @: " + postObj[key].taken_at + "</li>").appendTo(".hoverBox");
                    jQuery("<li>Comments: " + postObj[key].comment_count + "</li>").appendTo(".hoverBox");
                    jQuery("<li>Likes: " + postObj[key].like_count + "</li>").appendTo(".hoverBox");
                    //jQuery( "<li>Media:"+postObj[key].media+"</li>" ).appendTo( ".hoverBox" );
                    jQuery("<li>Hashtags:" + postObj[key].hashtags_used + "</li>").appendTo(".hoverBox");
                    jQuery("</ul>").appendTo(".hoverBox");
                }
            }
            if (jQuery('#mediaVis-0').is(':checked')) {
                jQuery(".hoverBox").show("slow");
            } else {
                jQuery(".hoverBox").hide();
            }
        });

    }

    $("body").on("click", ".nodeInfo", function(e) {
        console.log($(this).text());
        nodeOutsideRenderer($(this).attr("nodeReal"), $(this).attr("nodetype"))
    });

    $("body").on("click", ".deleteHistory", function(e) {
        e.preventDefault();
        $(".nodeHistory > li").remove();
    });

    $("body").on("click", "#computelouvain", function(e) {
        e.preventDefault();

        graphologyLibrary.communitiesLouvain.assign(graph, {
          randomWalk: false,
          getEdgeWeight: null,
          resolution: 0.38});
        $("<label style='background:red; color:white;'>done :)</label>").insertAfter($("#computelouvain"));
    });

      $("body").on("click", "#colorlouvain", function(e) {
        e.preventDefault();

        let comColors = [
            "#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58",
            "#53777A", "#78ec97", "#9c9595", "#fc9d9d", "#fcd49d",
            "#dbfc9d", "#8e407a", "#fe6962", "#f9ba84", "#eee097"
        ];

        let graphColors = {};

        graph.nodes().forEach((entry) => {
            let community = graph.getNodeAttributes(entry)['community'];

            if (community < comColors.length) {
                // Usa los primeros 15 colores
                graph.setNodeAttribute(entry, 'color', comColors[community]);
            } else {
                // Genera colores aleatorios para comunidades después de las primeras 15
                if (!(community in graphColors)) {
                    let randomColor = getRandomColor();
                    graphColors[community] = randomColor;
                    graph.setNodeAttribute(entry, 'color', randomColor);
                } else {
                    graph.setNodeAttribute(entry, 'color', graphColors[community]);
                }
            }
            });

      });

      function getRandomColor() {
          // Genera un color hexadecimal aleatorio
          return '#' + Math.floor(Math.random()*16777215).toString(16);
      }


      $("body").on("click", "#computecentrality", function(e) {
        e.preventDefault();
        graphologyLibrary.metrics.centrality.betweenness(graph);
        graphologyLibrary.metrics.centrality.betweenness.assign(graph, {
            normalized: true
        });
        console.log("betweenness done!");
        graphologyLibrary.metrics.centrality.closeness(graph);
        graphologyLibrary.metrics.centrality.closeness.assign(graph, {
            normalized: true
        });
        console.log("closeness done!");
        graphologyLibrary.metrics.centrality.degree(graph);
        graphologyLibrary.metrics.centrality.degree.assign(graph, {
            normalized: true
        });
        console.log("degree done!");
        graphologyLibrary.metrics.centrality.pagerank(graph);
        graphologyLibrary.metrics.centrality.pagerank.assign(graph, {
            maxIterations: 9000,
            alpha: 0.3
        });
        console.log("pagerank done!");
        $("<label style='background:red; color:white;'>done :)</label>").insertAfter($("#computecentrality"));
        //graphologyLibrary.metrics.centrality.eigenvector.assign(graph);
        //console.log("eigenvector done!");
    });
/* inicia
      $("body").on("click", "#betweennesssizecentrality", function(e) {
        e.preventDefault();
        graph.nodes().forEach((entry) => {
          //console.log(graph.getNodeAttributes(entry)['pagerank']);
          //graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['betweennessCentrality'] * 200) + 1);
          graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['betweennessCentrality']* 133) + 1);
          //graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['betweennessCentrality']/ 300) + 1);
        });
    });
      $("body").on("click", "#closenessizecentrality", function(e) {
        e.preventDefault();
        graph.nodes().forEach((entry) => {
          //console.log(graph.getNodeAttributes(entry)['pagerank']);
          //graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['closenessCentrality']) + 1);
          graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['closenessCentrality']* 9) + 1);
          //graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['closenessCentrality']* 100) + 1);
        });
      });
      $("body").on("click", "#degreesizecentrality", function(e) {
        e.preventDefault();
        graph.nodes().forEach((entry) => {
          //console.log(graph.getNodeAttributes(entry)['pagerank']);
          graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['degreeCentrality']* 193) + 1);
          //graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['degreeCentrality']* 1) + 1);
          //graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['degreeCentrality'] * 100) + 1);
        });
      });
      $("body").on("click", "#pageranksizecentrality", function(e) {
        e.preventDefault();
        graph.nodes().forEach((entry) => {
          //console.log(graph.getNodeAttributes(entry)['pagerank']);
          graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['pagerank'] * 3111) + 1);
        //  graph.setNodeAttribute(entry, 'size', (graph.getNodeAttributes(entry)['pagerank'] * 1111) + 1);
        });
      });
      */

      $("body").on("click", "#fixedsize", function(e) {
        e.preventDefault();
        graph.nodes().forEach((node) => {
          var nodetype = graph.getNodeAttributes(node)['nodetype']
          let drop_cont = 0;
          setNodeSize(node, nodetype, drop_cont);

        });
    });

// Calculate the scaling factor based on the maximum value of the specified centrality metric
function calculateScaleFactor(graph, centralityAttribute, desiredMaxSize) {
    const centralityValues = graph.nodes().map(node => graph.getNodeAttributes(node)[centralityAttribute]);
    const maxCentrality = Math.max(...centralityValues);
    // Adjust the scaling factor based on the max centrality value and desired maximum size
    const scaleFactor = maxCentrality > 0 ? desiredMaxSize / maxCentrality : 1;
    return scaleFactor;
}

// Update node sizes based on the specified centrality metric and scaling factor
function updateNodeSizes(graph, centralityAttribute, scaleFactor) {
    graph.nodes().forEach(node => {
        const centralityValue = graph.getNodeAttributes(node)[centralityAttribute];
        // Apply the scaling factor to adjust node sizes
        const newSize = centralityValue * scaleFactor;
        // Set the new size attribute for the node
        graph.setNodeAttribute(node, 'size', newSize);
    });
}

// Event listener for updating node sizes based on betweenness centrality
$("body").on("click", "#betweennesssizecentrality", function(e) {
    e.preventDefault();
    const centralityAttribute = 'betweennessCentrality';
    const desiredMaxSize = 50; // Adjust the desired maximum size as needed
    const scaleFactor = calculateScaleFactor(graph, centralityAttribute, desiredMaxSize);
    updateNodeSizes(graph, centralityAttribute, scaleFactor);
});

// Event listener for updating node sizes based on closeness centrality
$("body").on("click", "#closenessizecentrality", function(e) {
    e.preventDefault();
    const centralityAttribute = 'closenessCentrality';
    const desiredMaxSize = 50; // Adjust the desired maximum size as needed
    const scaleFactor = calculateScaleFactor(graph, centralityAttribute, desiredMaxSize);
    updateNodeSizes(graph, centralityAttribute, scaleFactor);
});

// Event listener for updating node sizes based on degree centrality
$("body").on("click", "#degreesizecentrality", function(e) {
    e.preventDefault();
    const centralityAttribute = 'degreeCentrality';
    const desiredMaxSize = 50; // Adjust the desired maximum size as needed
    const scaleFactor = calculateScaleFactor(graph, centralityAttribute, desiredMaxSize);
    updateNodeSizes(graph, centralityAttribute, scaleFactor);
});

// Event listener for updating node sizes based on PageRank centrality
$("body").on("click", "#pageranksizecentrality", function(e) {
    e.preventDefault();
    const centralityAttribute = 'pagerank';
    const desiredMaxSize = 50; // Adjust the desired maximum size as needed
    const scaleFactor = calculateScaleFactor(graph, centralityAttribute, desiredMaxSize);
    updateNodeSizes(graph, centralityAttribute, scaleFactor);
});

      function setNodeSize(node, nodetype, drop_cont) {
      if (nodeFixedSize == true) {

          if (nodetype == "hashtag") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 20) * 5);
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 15 ) + 1 );
              graph.setNodeAttribute(node, 'size', 4);
              graph.setNodeAttribute(node, 'color', com0);
              if (!networkfilter.includes("standard")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "post") {
              node_likes = graph.getNodeAttributes(node)['likes']
              //console.log(node_likes)
              //graph.setNodeAttribute(node, 'size', (node_likes / 500) + 3);
              graph.setNodeAttribute(node, 'size', 8);
              graph.setNodeAttribute(node, 'color', com1);
          } else if (nodetype == "user") {
              graph.setNodeAttribute(node, 'size', (graph.outDegree(node) + 1));
              //graph.setNodeAttribute(node, 'size', 15);
              graph.setNodeAttribute(node, 'size', 6);
              graph.setNodeAttribute(node, 'color', com2);
              if (!networkfilter.includes("standard")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "hashtag_class") {
              graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 90) + 6);
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              graph.setNodeAttribute(node, 'size', 15);
              graph.setNodeAttribute(node, 'color', com4)
              if (!networkfilter.includes("text_ai")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "ai_text_word") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 15 ) + 1 );
              graph.setNodeAttribute(node, 'size', 7);
              graph.setNodeAttribute(node, 'color', com5)
              if (!networkfilter.includes("text_ai")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "ai_text_hashtag") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 15 ) + 3 );
              graph.setNodeAttribute(node, 'size', 7);
              graph.setNodeAttribute(node, 'color', com0)
              if (!networkfilter.includes("text_ai")) {
                  //graph.dropNode(node);
              }
          } else if (nodetype == "ai_custom_inference") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 15 ) + 3 );
              graph.setNodeAttribute(node, 'size', 15);
              graph.setNodeAttribute(node, 'color', com7)
              if (!networkfilter.includes("image_ai")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
              //entity_individual & entity_sub
          } else if (nodetype == "entity_individual") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) * 2 ) + 1 );
              //graph.setNodeAttribute(node, 'size', (graph.outDegree(node)  / 30 ) + 3 );
              graph.setNodeAttribute(node, 'size', 7);
              graph.setNodeAttribute(node, 'color', com8)
              if (!networkfilter.includes("text_ai_entitites")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "entity_sub") {
              //	graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 3 );
              //graph.setNodeAttribute(node, 'size', 30);
              graph.setNodeAttribute(node, 'size', 9);
              graph.setNodeAttribute(node, 'color', com9)
              if (!networkfilter.includes("text_ai_entitites")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "ai_world_inference") {
                //	graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 3 );
                //graph.setNodeAttribute(node, 'size', 30);
                graph.setNodeAttribute(node, 'size', 5);
                graph.setNodeAttribute(node, 'color', com7)
                if (!networkfilter.includes("image_ai")) {
                    graph.dropNode(node);
                    drop_cont++;
                }
          }  else {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 10) * 10);
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 1 );
              graph.setNodeAttribute(node, 'size', 1);
              graph.setNodeAttribute(node, 'color', com10);
          }
      }
      //conditional nodeFixedSize
      else {

          if (nodetype == "hashtag") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 20) * 5);
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              hashtag_publications = graph.getNodeAttributes(node)['no_publications'];
                // Normaliza el tamaño usando la función normalize
                const normalizedSize = normalize(hashtag_publications, minNoPublications, maxNoPublications, 3, 20);
                graph.setNodeAttribute(node, 'size', normalizedSize);
              //graph.setNodeAttribute(node, 'size', 20 );
              graph.setNodeAttribute(node, 'color', com0);
              if (!networkfilter.includes("standard")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "post") {
            node_likes = graph.getNodeAttributes(node)['likes'];
            // Normaliza el tamaño usando la función normalize
            const normalizedSize = normalize(node_likes, minLikes, maxLikes, 3, 20);
            graph.setNodeAttribute(node, 'size', normalizedSize);
              graph.setNodeAttribute(node, 'color', com1);
          } else if (nodetype == "user") {
            user_followers = graph.getNodeAttributes(node)['followers'];
             // Normaliza el tamaño usando la función normalize
             const normalizedSize = normalize(user_followers, minFollowers, maxFollowers, 3, 20);
             graph.setNodeAttribute(node, 'size', normalizedSize);
              //graph.setNodeAttribute(node, 'size', (graph.outDegree(node) + 1));
              //graph.setNodeAttribute(node, 'size', 15);
              graph.setNodeAttribute(node, 'color', com2);
              if (!networkfilter.includes("standard")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "hashtag_class") {
              graph.setNodeAttribute(node, 'size', (graph.degree(node) / 9.333) + 0.333);
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              //graph.setNodeAttribute(node, 'size', 30);
              graph.setNodeAttribute(node, 'color', com4)
              if (!networkfilter.includes("text_ai")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "ai_text_word") {
              //graph.setNodeAttribute(node, 'size', (graph.degree(node) / 9.333) + 0.333);
              graph.setNodeAttribute(node, 'size', 3);
              graph.setNodeAttribute(node, 'color', com5)
              if (!networkfilter.includes("text_ai")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "ai_text_hashtag") {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              graph.setNodeAttribute(node, 'size', 3);
              //graph.setNodeAttribute(node, 'size', 10);
              graph.setNodeAttribute(node, 'color', com0)
              if (!networkfilter.includes("text_ai")) {
                  //graph.dropNode(node);
              }
          } else if (nodetype == "ai_custom_inference") {
            graph.setNodeAttribute(node, 'size', (graph.degree(node) / 9.333) + 0.333);
              //graph.setNodeAttribute(node, 'size', 30);
              graph.setNodeAttribute(node, 'color', com7)
              if (!networkfilter.includes("image_ai")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
              //entity_individual & entity_sub
          } else if (nodetype == "entity_individual") {
            //  graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) * 2 ) + 1 );
            graph.setNodeAttribute(node, 'size', 3);
              //graph.setNodeAttribute(node, 'size', 10);
              graph.setNodeAttribute(node, 'color', com8)
              if (!networkfilter.includes("text_ai_entitites")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          } else if (nodetype == "entity_sub") {
            graph.setNodeAttribute(node, 'size', (graph.degree(node) / 9.333) + 0.333);
            //graph.setNodeAttribute(node, 'size', 30);
              //graph.setNodeAttribute(node, 'size', 10);
              graph.setNodeAttribute(node, 'color', com9);
              if (!networkfilter.includes("text_ai_entitites")) {
                  graph.dropNode(node);
                  drop_cont++;
              }
          }  else if (nodetype == "ai_world_inference") {
                //	graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 3 );
                //graph.setNodeAttribute(node, 'size', 30);
                graph.setNodeAttribute(node, 'size', (graph.degree(node) / 9.333) + 0.333);
                graph.setNodeAttribute(node, 'color', com7)
                if (!networkfilter.includes("image_ai")) {
                    graph.dropNode(node);
                    drop_cont++;
                }
          } else {
              //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 10) * 10);
              graph.setNodeAttribute(node, 'size', (graph.degree(node) / 9.333) + 0.333);
              //graph.setNodeAttribute(node, 'size', 5);
              graph.setNodeAttribute(node, 'color', com10);
          }

      }
      //end else
    }

      $("#screenshot").on('click', function() {
        html2canvas($("#mountNode")[0], {
            scale: 3
        }).then((canvas) => {
            var t_MUID = $("#MUID").text()
            var t_Date = new Date().toISOString().slice(0, 19);
            console.log("done ... ");

            var url = canvas.toDataURL();

            var triggerDownload = $("<a>").attr("href", url).attr("download", t_MUID + "_" + t_Date + ".jpeg").appendTo("body");
            triggerDownload[0].click();
            triggerDownload.remove();
        })
    });

      $("#cleanNonInferenced").on('click', function() {
      var userNodes = [];

      // Obtener todos los nodos de tipo 'user'
      graph.nodes().forEach((node, i) => {
          var nodetype = graph.getNodeAttributes(node)['nodetype'];
          if (nodetype === 'user') {
              userNodes.push(node);
          }
      });

      // Iterar sobre los nodos de tipo 'user'
      userNodes.forEach((userNode) => {
          // Obtener el tipo de nodo 'user'
          var userNodeType = graph.getNodeAttributes(userNode)['nodetype'];
          console.log(`Usuario: ${userNode}`);

          // Iterar sobre todos los nodos en el grafo
          graph.nodes().forEach((node, i) => {
              var nodetype = graph.getNodeAttributes(node)['nodetype'];
              //debugger;

              if (userNodeType === 'user') {
                //debugger;
                  // Calcular el camino más corto si el tipo de nodo es 'ai_world_inference' o 'ai_custom_inference'
                //if (nodetype === 'ai_world_inference' || nodetype === 'ai_custom_inference') {
                if (nodetype === 'ai_custom_inference') {
                    console.log(`Inferencia OD: ${node}`);
                    var neighborsIns = graph.neighbors(node);
                      neighborsIns.forEach(neighborInsNode => {
                        console.log(neighborInsNode);
                            var nodetypeIns = graph.getNodeAttributes(neighborInsNode)['nodetype'];
                            if (nodetypeIns === 'post') {
                                  graph.neighbors(neighborInsNode);
                                  console.log(`Usuario: ${userNode}`);
                                  console.log(`Nodo MLI: ${node}`);
                                  console.log(`Post: ${neighborInsNode}`);
                                  console.log(`post neighbors: ${  graph.neighbors(neighborInsNode) }`);
                                   /*metodo 2 inicia aqui
                                      graph.neighbors(neighborInsNode).forEach(neighborInsNeighbor => {
                                          //console.log( graph.getNodeAttributes(neighborInsNeighbor) )
                                          if (graph.getNodeAttributes(neighborInsNeighbor)['nodetype'] === nodetype){
                                          console.log( graph.getNodeAttributes(neighborInsNeighbor) )
                                          console.log(neighborInsNode + '_' + node);

                                                // Adding a node with attributes:
                                                if (!graph.hasNode(neighborInsNode + '_' + node)) {
                                                      // Si no existe, añadir el nodo
                                                      graph.addNode(neighborInsNode + '_' + node, {
                                                          label: neighborInsNode + '_' + node,
                                                          nodetype: 'inference_MLI'
                                                        });
                                                      };

                                              graph.addEdge(neighborInsNode + '_' + node, node, {
                                                          //  weight: 1
                                                          });
                                            // graph.addEdge(node, neighborInsNode + '_' + node,{
                                                                      //  weight: 1
                                                                  //    });


                                                      }
                                            if (graph.getNodeAttributes(neighborInsNeighbor)['nodetype'] === 'user' && graph.hasNode(neighborInsNode + '_' + node) ){
                                                      console.log( graph.getNodeAttributes(neighborInsNeighbor) )


                                                          graph.addEdge(neighborInsNode + '_' + node, neighborInsNeighbor, {
                                                                        //weight: 1
                                                                      });
                                                          graph.addEdge( neighborInsNeighbor, neighborInsNode + '_' + node,{
                                                                                    //weight: 1
                                                                          });


                                                                  }


                                              //console.log( graph.getNodeAttributes(neighborInsNeighbor) )
                                            });
                                            metodo 2 inicia aqui   */

                              };
                            });
                        // metodo 1 funciona
                        var shortestpath = graphologyLibrary.shortestPath.bidirectional(graph, userNode, node);
                        // Verificar si shortestpath es null o indefinido antes de acceder a 'length'
                        if (shortestpath && shortestpath.length) {
                            if (shortestpath.length === 3) {
                                console.log(shortestpath);
                                console.log(`Inferencia OD: ${node}`);
                                graph.addEdge(node, userNode, {
                                      weight: 3
                                    });
                                //console.log(shortestpath);

                              //  graph.addEdge('John', 'Jack');

                                shortestpath.forEach(nodeToDelete => {
                                    //graph.dropNode(nodeToDelete);
                                    console.log(`Nodo ${nodeToDelete} se eliminirá`);
                                });
                            }
                        } else {
                            console.log(`El camino más corto es null o indefinido para Inferencia OD`);
                        }
                     // termina aqui


                  }

                  // Calcular el camino más corto si el tipo de nodo es 'hashtag_class' o 'entity_sub'
                  else if (nodetype === 'ai_text_word') {
                      console.log(`Inferencia BoW: ${node}`);
                      var shortestpath = graphologyLibrary.shortestPath.bidirectional(graph, userNode, node);

                      // Verificar si shortestpath es null o indefinido antes de acceder a 'length'
                      if (shortestpath && shortestpath.length) {
                          if (shortestpath.length === 4) {
                            console.log(shortestpath);
                            console.log(`Inferencia NLP ${node}`);
                            console.log(`Agregar enlace a ${shortestpath[3]}`);
                            console.log(shortestpath);
                            graph.addEdge(shortestpath[3], userNode, {
                                //  weight: 1
                                });
                              shortestpath.forEach(nodeToDelete => {
                                  //graph.addEdge(userNode, shortestpath[3]);
                                  //graph.dropNode(nodeToDelete);
                                  console.log(`Nodo ${nodeToDelete} se eliminirá`);
                              });
                          }
                      } else {
                          console.log(`El camino más corto es null o indefinido para Inferencia BoW`);
                      }
                  }
                  // Calcular el camino más corto si el tipo de nodo es 'hashtag_class' o 'entity_sub'
                  else if ( nodetype === 'entity_individual') {
                      console.log(`Inferencia OoV: ${node}`);
                      var shortestpath = graphologyLibrary.shortestPath.bidirectional(graph, userNode, node);

                      // Verificar si shortestpath es null o indefinido antes de acceder a 'length'
                      if (shortestpath && shortestpath.length) {
                          if (shortestpath.length === 4) {
                            console.log(`Inferencia NLP ${node}`);
                            console.log(`Agregar enlace a ${shortestpath[3]}`);
                            console.log(shortestpath);
                            graph.addEdge(shortestpath[3], userNode, {
                                  //weight: 1
                                });
                              shortestpath.forEach(nodeToDelete => {
                                  //graph.addEdge(userNode, shortestpath[3]);
                                  //graph.dropNode(nodeToDelete);
                                  console.log(`Nodo ${nodeToDelete} se eliminirá`);
                              });
                          }
                      } else {
                          console.log(`El camino más corto es null o indefinido para Inferencia OoV`);
                      }
                  }

              }

          });
          //  debugger;
      });

      graph.nodes().forEach((node, i) => {
          var nodetype = graph.getNodeAttributes(node)['nodetype'];
          if ( nodetype === 'post') {
              console.log(`Cambiar enlaces de : ${node}`);
              /* CAMBIAR ENLACES
              graph.neighbors(node).forEach((neighbor, i) => {
                    var nodetype = graph.getNodeAttributes(neighbor)['nodetype'];
                    if (nodetype === 'ai_world_inference' || nodetype === 'ai_custom_inference') {
                      graph.edges(node, neighbor).forEach((edgeNeighbor, i) => {
                        graph.dropEdge(edgeNeighbor);
                      });
                    } else {
                      console.log(node);
                      console.log(neighbor);
                      graph.edges(node, neighbor).forEach((edgeNeighbor, i) => {
                        graph.dropEdge(edgeNeighbor);
                      });

                      //debugger;
                    }
              });
              */


          }


      if (nodetype === 'ai_world_inference' || nodetype === 'hashtag' || nodetype === 'post') {
         //if (nodetype === 'ai_world_inference') {
          //if (nodetype === 'hashtag') {
          //if (nodetype === 'hashtag' || nodetype === 'post') {
              // Eliminar nodos de tipo 'hashtag' o 'post'
              graph.dropNode(node);
              console.log(`Nodo ${node} eliminado.`);
          }
      });

      graph.nodes().forEach((node, i) => {
          if (graph.degree(node) <= 1) {
                              graph.dropNode(node);
                              console.log(node);
                          }
      });

      graphologyLibrary.layout.circlepack.assign(graph);

      renderer.refresh();

    });

      $("#deletePostHashtags").on('click', function () {
      graph.nodes().forEach((node, i) => {
          var nodetype = graph.getNodeAttributes(node)['nodetype'];
          //if (nodetype === 'ai_world_inference') {
           //if (nodetype === 'hashtag') {
          if (nodetype === 'hashtag' || nodetype === 'post') {
               // Eliminar nodos de tipo 'hashtag' o 'post'
               graph.dropNode(node);
               console.log(`Nodo ${node} eliminado.`);
           }
         });
     });
      $("#countnodeType").on('click', function () {
          // Variables para contar los nodos
          var totalNodeCount = 0;
          var postCount = 0;
          var userCount = 0;
          var hashtagCount = 0;
          var aiCustomInferenceCount = 0;
          var entitySubCount = 0;
          var aiTextWordCount = 0;
          var hashtagClassCount = 0;
          var entityIndividualCount = 0;
          var aiWorldInferenceCount = 0;

          // Iterar sobre todos los nodos en el grafo
          graph.nodes().forEach((node) => {
              // Obtener el tipo de nodo de manera segura
              var nodetype = graph.getNodeAttributes(node) && graph.getNodeAttributes(node)['nodetype'];

              // Incrementar el contador total de nodos
              totalNodeCount++;

              // Verificar el tipo de nodo y actualizar el contador correspondiente
              switch (nodetype) {
                  case 'post':
                      postCount++;
                      break;
                  case 'user':
                      userCount++;
                      break;
                  case 'hashtag':
                      hashtagCount++;
                      break;
                  case 'ai_custom_inference':
                      aiCustomInferenceCount++;
                      break;
                  case 'entity_sub':
                      entitySubCount++;
                      break;
                  case 'ai_text_word':
                      aiTextWordCount++;
                      break;
                  case 'hashtag_class':
                      hashtagClassCount++;
                      break;
                  case 'entity_individual':
                      entityIndividualCount++;
                      break;
                  case 'ai_world_inference':
                      aiWorldInferenceCount++;
                      break;
                  // Agregar casos para otros tipos de nodos según sea necesario
              }
          });

          // Mostrar los resultados
          var resultadosHTML = `
              <p>Número total de nodos: ${totalNodeCount}</p>
              <p>Número de nodos de tipo 'post': ${postCount}</p>
              <p>Número de nodos de tipo 'user': ${userCount}</p>
              <p>Número de nodos de tipo 'hashtag': ${hashtagCount}</p>
              <p>Número de nodos de tipo 'ai_custom_inference': ${aiCustomInferenceCount}</p>
              <p>Número de nodos de tipo 'entity_sub': ${entitySubCount}</p>
              <p>Número de nodos de tipo 'ai_text_word': ${aiTextWordCount}</p>
              <p>Número de nodos de tipo 'hashtag_class': ${hashtagClassCount}</p>
              <p>Número de nodos de tipo 'entity_individual': ${entityIndividualCount}</p>
              <p>Número de nodos de tipo 'ai_world_inference': ${aiWorldInferenceCount}</p>
          `;

          // Agregar los resultados justo debajo del botón
          $("#resultados").html(resultadosHTML);
      });

      $("#countnodeTypeState").on('click', function () {
            // Variables para contar los nodos
            var totalNodeCount = 0;
            var postCount = 0;
            var userCount = 0;
            var hashtagCount = 0;
            var aiCustomInferenceCount = 0;
            var entitySubCount = 0;
            var aiTextWordCount = 0;
            var hashtagClassCount = 0;
            var entityIndividualCount = 0;
            var aiWorldInferenceCount = 0;
            var inference_MLICount = 0;

            state.selectedNeighbors.forEach((node) => {
                // Obtener el tipo de nodo de manera segura
                var nodetype = graph.getNodeAttributes(node) && graph.getNodeAttributes(node)['nodetype'];

                // Incrementar el contador total de nodos
                totalNodeCount++;

                // Verificar el tipo de nodo y actualizar el contador correspondiente
                switch (nodetype) {
                    case 'post':
                        postCount++;
                        break;
                    case 'user':
                        userCount++;
                        break;
                    case 'hashtag':
                        hashtagCount++;
                        break;
                    case 'ai_custom_inference':
                        aiCustomInferenceCount++;
                        break;
                    case 'entity_sub':
                        entitySubCount++;
                        break;
                    case 'ai_text_word':
                        aiTextWordCount++;
                        break;
                    case 'hashtag_class':
                        hashtagClassCount++;
                        break;
                    case 'entity_individual':
                        entityIndividualCount++;
                        break;
                    case 'ai_world_inference':
                        aiWorldInferenceCount++;
                        break;
                    case 'inference_MLI':
                        inference_MLICount++;
                        break;
                    // Agregar casos para otros tipos de nodos según sea necesario
                }
            });


            state.selectedNeighborsNeighbors.forEach((node) => {
                // Obtener el tipo de nodo de manera segura
                var nodetype = graph.getNodeAttributes(node) && graph.getNodeAttributes(node)['nodetype'];

                // Incrementar el contador total de nodos
                totalNodeCount++;

                // Verificar el tipo de nodo y actualizar el contador correspondiente
                switch (nodetype) {
                    case 'post':
                        postCount++;
                        break;
                    case 'user':
                        userCount++;
                        break;
                    case 'hashtag':
                        hashtagCount++;
                        break;
                    case 'ai_custom_inference':
                        aiCustomInferenceCount++;
                        break;
                    case 'entity_sub':
                        entitySubCount++;
                        break;
                    case 'ai_text_word':
                        aiTextWordCount++;
                        break;
                    case 'hashtag_class':
                        hashtagClassCount++;
                        break;
                    case 'entity_individual':
                        entityIndividualCount++;
                        break;
                    case 'ai_world_inference':
                        aiWorldInferenceCount++;
                        break;
                    case 'inference_MLI':
                        inference_MLICount++;
                       break;
                    // Agregar casos para otros tipos de nodos según sea necesario
                }
            });
            // Mostrar los resultados
            var resultadosHTML = `
                <p>Número total de nodos: ${totalNodeCount}</p>
                <p>Número de nodos de tipo 'post': ${postCount}</p>
                <p>Número de nodos de tipo 'user': ${userCount}</p>
                <p>Número de nodos de tipo 'hashtag': ${hashtagCount}</p>
                <p>Número de nodos de tipo 'ai_custom_inference': ${aiCustomInferenceCount}</p>
                <p>Número de nodos de tipo 'entity_sub': ${entitySubCount}</p>
                <p>Número de nodos de tipo 'ai_text_word': ${aiTextWordCount}</p>
                <p>Número de nodos de tipo 'hashtag_class': ${hashtagClassCount}</p>
                <p>Número de nodos de tipo 'entity_individual': ${entityIndividualCount}</p>
                <p>Número de nodos de tipo 'ai_world_inference': ${aiWorldInferenceCount}</p>
                <p>Número de nodos de tipo 'inference_MLI': ${inference_MLICount}</p>
            `;

            // Agregar los resultados justo debajo del botón
            $("#resultados2").html(resultadosHTML);
        });

        function contarNodosConUsuariosVinculados(graph, maxResults = 20) {
            // Crear un objeto para almacenar la cuenta de nodos y sus usuarios vinculados
            var nodosConUsuarios = {};

            // Lista de nodos que dieron positivo al encontrarse en la lista de vecinos
            var nodosConEntPositivos = [];

            // Iterar sobre todos los nodos de tipo 'entity_individual'
            graph.forEachNode((node, attributes) => {
                if (attributes.nodetype === 'entity_individual') {
                    // Obtener los vecinos del nodo actual
                    var vecinos = graph.neighbors(node);

                    // Contar el número de vecinos (usuarios vinculados)
                    var numUsuarios = vecinos.length;

                    // Agregar a la cuenta
                    nodosConUsuarios[node] = numUsuarios;

                    // Verificar si la cadena "ent_" + nodo existe en la lista de vecinos
                    //var nodoConEnt = "ent_" + node;
                    // Encuentra la posición de la subcadena y toma la parte restante
                    var cadenaOriginal = node.toString();
                    var subcadena = "ent_";

                    var nuevaCadena = cadenaOriginal.substring(subcadena.length);
                    console.log(nuevaCadena)
                    var existeEnVecinos = vecinos.includes(nuevaCadena);

                    // Agregar a la lista de nodos con nodosConEnt que dieron positivo
                    if (existeEnVecinos) {
                        nodosConEntPositivos.push(node); // Quitando "ent_" de la cadena
                    }
                    debugger;
                }
            });

            // Ordenar los nodos por la cantidad de usuarios vinculados en orden descendente
            var sortedNodes = Object.keys(nodosConUsuarios).sort((a, b) => nodosConUsuarios[b] - nodosConUsuarios[a]);

            // Obtener los primeros 'maxResults' resultados
            var topResults = sortedNodes.slice(0, maxResults);

            // Mostrar los resultados
            var resultadosHTML = '<p>Top 20 nodos de tipo \'entity_individual\' con la cantidad de usuarios vinculados:</p>';
            topResults.forEach((node) => {
                var numUsuarios = nodosConUsuarios[node];
                var usuariosVinculados = graph.neighbors(node);

                resultadosHTML += `<p>Nodo: ${node}, Usuarios vinculados: ${numUsuarios}, <br> Lista de usuarios: ${usuariosVinculados.join(', ')}</p>`;
            });

            // Mostrar la lista de nodos con nodosConEnt que dieron positivo
            resultadosHTML += '<p>Nodos con nodosConEnt que dieron positivo en la lista de vecinos:</p>';
            resultadosHTML += '<ul>';
            nodosConEntPositivos.forEach((nodoPositivo) => {
                resultadosHTML += `<li>${nodoPositivo}</li>`;
            });
            resultadosHTML += '</ul>';

            // Agregar los resultados justo debajo del botón
            $("#resultados3").html(resultadosHTML);
        }

        // Llamar a la función cuando se haga clic en el botón
        $("#contarNodosConUsuariosVinculados").on('click', function () {
            contarNodosConUsuariosVinculados(graph, 20);
       });
</script>
<?php include('includes/footer.php'); ?>
<style>

</style>

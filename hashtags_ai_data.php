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

$nodeMinDegree = isset($_GET['nodeMinDegree']) ? $_GET['nodeMinDegree'] : 0;
$gravity = isset($_GET['gravity']) ?  $_GET['gravity'] : 1;
$iterations = isset($_GET['iterations']) ? $_GET['iterations'] : 133;
$scale = isset($_GET['scale']) ? $_GET['scale'] : 5000;
$adjustSizes = isset($_GET['adjustSizes']) ? $_GET['adjustSizes'] : 'false';
$barnesHutOptimize = isset($_GET['barnesHutOptimize']) ? $_GET['barnesHutOptimize'] : 'false';
$barnesHutTheta = isset($_GET['barnesHutTheta']) ? $_GET['barnesHutTheta'] : 0.5;
$linLogMode = isset($_GET['linLogMode']) ? $_GET['linLogMode'] : 'false';
$outboundAttractionDistribution = isset($_GET['outboundAttractionDistribution']) ? $_GET['outboundAttractionDistribution'] : 'false';
$scalingRatio = isset($_GET['scalingRatio']) ? $_GET['scalingRatio'] : 1;
$slowDown = isset($_GET['slowDown']) ? $_GET['slowDown'] : 1;
$strongGravityMode = isset($_GET['strongGravityMode']) ? $_GET['strongGravityMode'] : 'false';
$networkfilter_get = isset($_GET['networkfilter']) ? $_GET['networkfilter'] : ["standard", "text_ai", "image_ai"];

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
<script src="/vista/includes/js-networks/graphology.js"></script>
<script src="/vista/includes/js-networks/graphology-library.js"></script>
<script src="/vista/includes/js-networks/sigma.js"></script>
<div class="container p-4">
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
<form method="GET" action="<?php echo $_SERVER['PHP_SELF']; ?>" >
<div class="form-group">
    <label for="id">ID</label> 
    <input id="id" name="id" value="<?php echo $id?>" type="text" class="form-control"> 
  </div>
  <div class="form-group">
    <label>Network will include:</label> 
    <div>
      <div class="custom-controls-stacked">
        <div class="custom-control custom-checkbox">
          <input name="networkfilter[]" id="networkfilter_0" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="standard" 
			 <?php if (in_array("standard", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>
          > 
          <label for="networkfilter_0" class="custom-control-label">Standard</label>
        </div>
      </div>
      <div class="custom-controls-stacked">
        <div class="custom-control custom-checkbox">
          <input name="networkfilter[]" id="networkfilter_1" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="text_ai" 
          <?php if (in_array("text_ai", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>
          > 
          <label for="networkfilter_1" class="custom-control-label">Text_AI</label>
        </div>
      </div>
      <div class="custom-controls-stacked">
        <div class="custom-control custom-checkbox">
          <input name="networkfilter[]" id="networkfilter_2" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="image_ai" 
          <?php if (in_array("image_ai", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>
				> 
          <label for="networkfilter_2" class="custom-control-label">Image_AI</label>
        </div>
      </div>
      <div class="custom-controls-stacked">
        <div class="custom-control custom-checkbox">
          <input name="networkfilter[]" id="networkfilter_3" type="checkbox" aria-describedby="networkfilterHelpBlock" class="custom-control-input" value="text_ai_entitites"
          <?php if (in_array("text_ai_entitites", $networkfilter_get)) {
    			echo 'checked="checked"';
				} ?>
				>  
          <label for="networkfilter_3" class="custom-control-label">Text_AI_Entitites</label>
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
  <div class="form-group">
    <label for="iterations">Iterations of ForceAtlas2 Layout</label> 
    <input id="iterations" name="iterations" value="<?php echo $iterations ?>" type="text" aria-describedby="iterationsHelpBlock" class="form-control"> 
    <span id="iterationsHelpBlock" class="form-text text-muted">Iterations used to set the position of the nodes with ForceAtlas2 algorithm. If this is set to 1 graph will remain in the circile layout initial position. Higher number will require extensive CPU workload. Default is set in 133 a number that will work with different datasets and is not really high.</span>
  </div>
  <div class="form-group">
    <label for="gravity">Gravity</label> 
    <input id="gravity" name="gravity" value="<?php echo $gravity ?>" type="text" class="form-control">
  </div>
  <div class="form-group row">
    <label class="col-6">Should the node’s sizes be taken into account?</label> 
    <div class="col-6">
      <div class="custom-control custom-radio custom-control-inline">
        <input name="adjustSizes" id="adjustSizes_0" type="radio" class="custom-control-input" value="true"
			<?php echo $adjustSizes == 'true' ? 'checked':'' ; ?> > 
        <label for="adjustSizes_0" class="custom-control-label">true</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input name="adjustSizes" id="adjustSizes_1" type="radio" class="custom-control-input" value="false" 
        <?php echo $adjustSizes == 'false' ? 'checked':'' ; ?> >  
        <label for="adjustSizes_1" class="custom-control-label">false</label>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label class="col-6">Use the Barnes-Hut approximation to compute repulsion in O(n*log(n)) rather than default O(n^2), n being the number of nodes.</label> 
    <div class="col-6">
      <div class="custom-control custom-radio custom-control-inline">
        <input name="barnesHutOptimize" id="barnesHutOptimize_0" type="radio" class="custom-control-input" value="true" 
        <?php echo $barnesHutOptimize == 'true' ? 'checked':'' ; ?> > 
        <label for="barnesHutOptimize_0" class="custom-control-label">true</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input name="barnesHutOptimize" id="barnesHutOptimize_1" type="radio" class="custom-control-input" value="false" 
        <?php echo $barnesHutOptimize == 'false' ? 'checked':'' ; ?> >
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
        <input name="outboundAttractionDistribution" id="outboundAttractionDistribution_0" type="radio" class="custom-control-input" value="true"
        <?php echo $outboundAttractionDistribution == 'true' ? 'checked':'' ; ?> >
        <label for="outboundAttractionDistribution_0" class="custom-control-label">true</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input name="outboundAttractionDistribution" id="outboundAttractionDistribution_1" type="radio" class="custom-control-input" value="false" 
        <?php echo $outboundAttractionDistribution == 'false' ? 'checked':'' ; ?> > 
        <label for="outboundAttractionDistribution_1" class="custom-control-label">false</label>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label class="col-6">Use Noack’s LinLog model?</label> 
    <div class="col-6">
      <div class="custom-control custom-radio custom-control-inline">
        <input name="linLogMode" id="linLogMode_0" type="radio" class="custom-control-input" value="true"
        <?php echo $linLogMode == 'true' ? 'checked':'' ; ?> > 
        <label for="linLogMode_0" class="custom-control-label">true</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input name="linLogMode" id="linLogMode_1" type="radio" class="custom-control-input" value="false"
        <?php echo $linLogMode == 'false' ? 'checked':'' ; ?> > 
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
        <input name="strongGravityMode" id="strongGravityMode_0" type="radio" class="custom-control-input" value="true"
			<?php echo $strongGravityMode == 'true' ? 'checked':'' ; ?> >
        <label for="strongGravityMode_0" class="custom-control-label">true</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input name="strongGravityMode" id="strongGravityMode_1" type="radio" class="custom-control-input" value="false" 
        <?php echo $strongGravityMode == 'false' ? 'checked':'' ; ?> >
        <label for="strongGravityMode_1" class="custom-control-label">false</label>
      </div>
    </div>
  </div> 
  <div class="form-group">
    <label for="scale">Initial circular scale</label> 
    <input id="scale" name="scale" value="<?php echo $scale ?>" type="text" class="form-control">
  </div> 
  <div class="form-group">
    <button name="submit" type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>  	
  	</div>
  	</div>
  	
  </div>
  
  
  <div class="row">
    <div class="col-md-12">
      <div class="card card-body">
        <h4>Network Graph User</h4>
        <div style="position:relative; z-index:2;" id="sigma-logs">
          <div class="hoverBox hashtag">
            </div>
               
               </div>
        <div id="mountNode" style="
                height: 800px;
                width: 100%;">
          </div>

      </div>
    </div>
  </div>

</div>

<script>
const graph = new graphology.MultiGraph();
const container = document.getElementById("mountNode");
var MUID = <?php echo "'$MUID'" ?>; 
var nodeMinDegree = <?php echo $nodeMinDegree ?>;  
var gravity = <?php echo $gravity ?>; 
var iterations = <?php echo $iterations ?>; 
var scale = <?php echo $scale ?>;
var adjustSizes = <?php echo $adjustSizes ?>;
var barnesHutOptimize = <?php echo $barnesHutOptimize ?>;
var barnesHutTheta = <?php echo $barnesHutTheta ?>;
var linLogMode = <?php echo $linLogMode ?>;
var outboundAttractionDistribution= <?php echo $outboundAttractionDistribution ?>;
var scalingRatio = <?php echo $scalingRatio ?>;
var slowDown = <?php echo $slowDown ?>;
var strongGravityMode = <?php echo $strongGravityMode ?>;


var networkfilter = <?php echo $networkfilter_json ?>;

alert(networkfilter);

// Replace ./data.json with your JSON feed
let com0= "#556270";
let com1= "#4ECDC4";
let com2= "#C7F464";
let com3= "#FF6B6B";
let com4= "#FFA500";
let com5= "#F7CD80";
let com6= "#EAD7B5";
let com7= "#982AA5";
let com8= "#A52A2A";



fetch('https://data.abundis.com.mx/vista/json_actions/json_scandir_ai.php?MUID='+MUID).then(response => {
  return response.json();
}).then(data => {
    //Todo el recorrido
  console.log(data);
  Object.entries(data).forEach(function([key, item]){
        console.log(item);
        //Hacer funcion
        fetch('./json/ai/'+item).then(response => {
  return response.json();
}).then(data => {
            //pide data
  console.log(data);
    Object.entries(data['nodes']).forEach(function([key, item]){
//da de alta nodos
    if(key='nodes'){
        //console.log(item['id']);
        if (graph.hasNode(item['id'])){
            //console.log("Ya existe");
        } else {
            //console.log("Agregar");
            graph.addNode(item['id'], {label: item['id'], nodetype: item['type']});
        }  
    }
});
    Object.entries(data['edges']).forEach(function([key, item]){

    if(key='edges'){
        if (graph.hasEdge(item['source'], item['target'])){
            //console.log("edge existia");
        } else {
            if (graph.hasNode(item['target'])){
                graph.addEdge(item['source'], item['target']);
            } else{
                //console.log("no existia nodo target");
                //graph.addNode(item['target'], {label: item['target']});
                //graph.addEdge(item['source'], item['target'])
            }
                }
    }
});
    
}).then(function(){
console.log('Number of nodes', graph.order);
console.log('Number of edges', graph.size);
             
let drop_cont = 0; 
graph.nodes().forEach((node, i) => {
   
    //console.log(graph.degree(node));
    if (graph.degree(node) <= nodeMinDegree){
        drop_cont++; 
        graph.dropNode(node);
        //console.log(drop_cont);
    } else {
        var nodetype = graph.getNodeAttributes(node)['nodetype']
        if (nodetype == "hashtag" ) {
            //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 20) * 5);
            //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
            graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 3 );
            //graph.setNodeAttribute(node, 'size', 20 );
            graph.setNodeAttribute(node, 'color', com0);
            if (!networkfilter.includes("standard") ) {
    					graph.dropNode(node);
    					}
        } else if (nodetype == "post") {            
            graph.setNodeAttribute(node, 'size', 6);
            graph.setNodeAttribute(node, 'color', com1);
        } else if (nodetype == "user") {
        		graph.setNodeAttribute(node, 'size', (graph.outDegree(node) + 3) );
            //graph.setNodeAttribute(node, 'size', 15);
            graph.setNodeAttribute(node, 'color', com2);
    			if (!networkfilter.includes("standard") ) {
    				graph.dropNode(node);
    				}
		  } else if (nodetype == "hashtag_class") {
		  		//graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
            graph.setNodeAttribute(node, 'size', 30);
            graph.setNodeAttribute(node, 'color', com4)
            if (!networkfilter.includes("text_ai") ) {
    				graph.dropNode(node);
    				}
        } else if (nodetype == "ai_text_word") {
        		//graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
            graph.setNodeAttribute(node, 'size', 9);
            graph.setNodeAttribute(node, 'color', com5)
            if (!networkfilter.includes("text_ai") ) {
    				graph.dropNode(node);
    				}
        } else if (nodetype == "ai_text_hashtag") {
        		//graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
				graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 3 );
            //graph.setNodeAttribute(node, 'size', 10);
            graph.setNodeAttribute(node, 'color', com6)
            if (!networkfilter.includes("text_ai") ) {
    				//graph.dropNode(node);
    				}
        } else if (nodetype == "ai_custom_inference") {
        		//graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
            graph.setNodeAttribute(node, 'size', 30);
            graph.setNodeAttribute(node, 'color', com7)
            if (!networkfilter.includes("image_ai") ) {
    				graph.dropNode(node);
    				}     
        } else {
            //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 10) * 10);
            //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)  / 20 ) + 1 );
            graph.setNodeAttribute(node, 'size', 5);
            graph.setNodeAttribute(node, 'color', com8);
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
console.log(drop_cont)}).then(function(){
console.log("ultima");
console.log("Densidad: " + graphologyLibrary.metrics.graph.density(graph));

//const louvain =  new graphologyLibrary.communitiesLouvain(graph);
//console.log("Louvain: " + JSON.stringify( louvain )); 
//graphologyLibrary.communitiesLouvain.assign(graph);
graphologyLibrary.layout.circular.assign(graph, {scale:scale});
//const statsLouvain = graphologyLibrary.communitiesLouvain.detailed(graph);

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
          
graphologyLibrary.layoutForceAtlas2.assign(graph, {
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
            
}).then(function(){
            
    let drop_cont = 0; 
    graph.nodes().forEach((node, i) => {
      console.log( graph.getNodeAttributes(node) );
    })}).catch(err => {
  console.log(err);
});
        
        //fin
});   
    
}).catch(err => {
  console.log(err);
});
    
const renderer = new Sigma(graph, container, {
  // We don't have to declare edgeProgramClasses here, because we only use the default ones ("line" and "arrow")
  renderEdgeLabels: true,
  allowInvalidContainer: true,
  enableEdgeClickEvents: true,
  enableEdgeWheelEvents: true,
  enableEdgeHoverEvents: "debounce",
  //defaultEdgeColor: "red",
});
    
  const state = {};
  renderer.on("clickNode", ({ node }) => {
    state.hoveredNode = node;
    state.selectedNode = node;
    state.hoveredNeighbors = new Set(graph.neighbors(node));
    state.hoveredNeighborsNeighbors =new Set();
    graph.neighbors(node).forEach( function(el) {
        console.log("algo");
        console.log(el);
        graph.neighbors(el).forEach(item => state.hoveredNeighborsNeighbors.add(item))
    });
      //console.log(state.hoveredNeighbors)
      //console.log(state.hoveredNeighborsNeighbors)
      hashtagFetchInfo(node);
    renderer.refresh();
  });
  renderer.on("clickStage", () => {
    state.hoveredNode = undefined;
    state.hoveredNeighbors = undefined;
    state.hoveredNeighborsNeighbors = undefined;
    state.selectedNode = undefined;
    jQuery( ".hoverBox" ).hide( "slow" );
    renderer.refresh();
  });
  renderer.setSetting("nodeReducer", (node, data) => {
    const res = { ...data };
    if (
      state.hoveredNeighborsNeighbors &&
      state.hoveredNeighborsNeighbors.has(node)
    ) {
       res.color = "#fdc1c1";
    } else if (
      state.hoveredNeighbors && 
      !state.hoveredNeighbors.has(node) &&
      state.hoveredNode !== node   
    ) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
      res.highlighted = true;
      res.color = "#FF6B6B";
    }
    return res;
  });
  renderer.setSetting("edgeReducer", (edge, data) => {
    const res = { ...data };
    if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
      res.hidden = true;
    }
    return res;
  });

  renderer.refresh();
    
function hashtagFetchInfo(node){
    console.log(graph.getNodeAttributes(node)['nodetype']);
    console.log(node);
    var nodeType = graph.getNodeAttributes(node)['nodetype']
    var settings = {
            "url": "json_hashtag_data.php",
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

        $.ajax(settings).done(function (response) {
            if (graph.getNodeAttributes(node)['nodetype'] == 'hashtag'){
             console.log("HOLA BABOCHON")   
            }
            jQuery( ".hoverBox" ).empty();
            jQuery( "<h5>Hashtag: <b><a target='_blank' href='https://www.instagram.com/explore/tags/"+response['hashtag_info']['node']+"'>"+response['hashtag_info']['node']+"</a></b></h5>" ).appendTo( ".hoverBox" );
            jQuery( "<h6>Amount: <b>"+response['hashtag_info']['no_publications']+"</b></h6>" ).appendTo( ".hoverBox" );
            
            console.log(response['post']);
            var postObj = response['post'];
            for (const key in postObj) {
                if (postObj.hasOwnProperty(key)) {
                    //alert(postObj[key].user_id);
                    jQuery( "<ul>" ).appendTo( ".hoverBox" );
                    jQuery( "<li>User: "+postObj[key].user_id+"</li>" ).appendTo( ".hoverBox" );
                    jQuery( "<li>Posted @: "+postObj[key].taken_at+"</li>" ).appendTo( ".hoverBox" );
                    jQuery( "<li>Comments: "+postObj[key].comment_count+"</li>" ).appendTo( ".hoverBox" );
                    jQuery( "<li>Likes: "+postObj[key].like_count+"</li>" ).appendTo( ".hoverBox" );
                    //jQuery( "<li>Media:"+postObj[key].media+"</li>" ).appendTo( ".hoverBox" );
                    jQuery( "<li>Hashtags:"+postObj[key].hashtags_used+"</li>" ).appendTo( ".hoverBox" );
                    jQuery( "</ul>" ).appendTo( ".hoverBox" );
                }
            }
            jQuery( ".hoverBox" ).show( "slow" );
        });
    
    }  


</script>
<?php include('includes/footer.php'); ?>
<style>
    
.hoverBox {
    position: absolute;
    width: 40%;
    background: rgba(255, 255, 255, 0.33);
    height: 800px;
    overflow-y: scroll;
    display: none;
    border: 2px solid #dbdbdb;
    padding: 1rem;
    border-radius: 1rem 0 0 1rem;
    right: 0;
}
    
.hoverBox li {
        font-size: 0.777rem;
    }
    
.hoverBox::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.hoverBox::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.4);
}

.hoverBox::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
</style>

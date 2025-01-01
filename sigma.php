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
  </div>
  <div class="row">
    <div class="col-md-12">
      <div class="card card-body">
        <h4>Network Graph User</h4>
          <div style="display:none!important;" id="sigma-logs"></div>
        <div id="mountNode" style="
                height: 800px;
                width: 100%;">
          </div>
<script>
const graph = new graphology.DirectedGraph();
const container = document.getElementById("mountNode");
var MUID = <?php echo "'$MUID'" ?>; 
<?php echo "console.log(MUID);" ?>
// Replace ./data.json with your JSON feed
let com1= "#4ECDC4";
let com2= "#C7F464";
let com3= "#FF6B6B";
let com4= "#C44D58";
let com5= "#53777A";
let com6= "#78ec97";
let com0= "#556270";


fetch('https://data.abundis.com.mx/vista/json_scandir.php?MUID='+MUID).then(response => {
  return response.json();
}).then(data => {
    //Todo el recorrido
  console.log(data);
  Object.entries(data).forEach(function([key, item]){
        console.log(item);
        //Hacer funcion
        fetch('./json/'+item).then(response => {
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
            graph.addNode(item['id'], {label: item['id']});
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
    //console.log(node);
    //console.log(graph.degree(node));
    if (graph.degree(node) <= 0){
        drop_cont++; 
        graph.dropNode(node);
        //console.log(drop_cont);
    } else {
    graph.setNodeAttribute(node, 'size', graph.inDegree(node) / 10) + 1;
    }
});
            
console.log(drop_cont)}).then(function(){
console.log("ultima");
console.log("Densidad: " + graphologyLibrary.metrics.graph.density(graph));

const louvain =  new graphologyLibrary.communitiesLouvain(graph);
//console.log("Louvain: " + JSON.stringify( louvain )); 
graphologyLibrary.communitiesLouvain.assign(graph);
graphologyLibrary.layout.random.assign(graph);
const statsLouvain = graphologyLibrary.communitiesLouvain.detailed(graph);

graphologyLibrary.layoutForceAtlas2.assign(graph, {
  iterations: 100,
  settings: {
    gravity: 0.1,
  }
})

Object.entries(louvain).forEach((entry) => {
    console.log("colorear");
    let node = entry[0]
    let community = entry[1]
    
    if (community == 0 ) {
        graph.setNodeAttribute(entry[0], 'color', com0);
    } else if (community == 1) {
        graph.setNodeAttribute(entry[0], 'color', com1);
    } else if (community == 2) {
        graph.setNodeAttribute(entry[0], 'color', com2);
    } else if (community == 3) {
        graph.setNodeAttribute(entry[0], 'color', com3);
    } else if (community == 4) {
        graph.setNodeAttribute(entry[0], 'color', com4);
    } else if (community == 5) {
        graph.setNodeAttribute(entry[0], 'color', com5);
    } else if (community == 6) {
        graph.setNodeAttribute(entry[0], 'color', com6);
    } else {
        graph.setNodeAttribute(entry[0], 'color', '#cccccc');
    }
});
    
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
    state.hoveredNeighbors = new Set(graph.neighbors(node));
    renderer.refresh();
  });
  renderer.on("clickStage", () => {
    state.hoveredNode = undefined;
    state.hoveredNeighbors = undefined;
    renderer.refresh();
  });
  renderer.setSetting("nodeReducer", (node, data) => {
    const res = { ...data };

    if (
      state.hoveredNeighbors &&
      !state.hoveredNeighbors.has(node) &&
      state.hoveredNode !== node
    ) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
      res.highlighted = true;
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
    
    


</script>
      </div>
    </div>
  </div>
</div>
<?php include('includes/footer.php'); ?>

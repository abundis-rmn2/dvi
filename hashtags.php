<?php
include("db.php");
$title = '';
$description= '';

if (isset($_GET['NodeMinDegree'])){
    $NodeMinDegree = $_GET['NodeMinDegree'];
} else {
    $NodeMinDegree = 0;
}

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
        <div style="position:relative; z-index:2;" id="sigma-logs">
          <div class="hoverBox hashtag">
            </div>
               
               </div>
        <div id="mountNode" style="
                height: 800px;
                width: 100%;">
          </div>
<script>
const graph = new graphology.MultiGraph();
const container = document.getElementById("mountNode");
var MUID = <?php echo "'$MUID'" ?>; 
var NodeMinDegree = <?php echo $NodeMinDegree ?>; 

<?php echo "console.log(MUID);" ?>
// Replace ./data.json with your JSON feed
let com0= "#556270";
let com1= "#4ECDC4";
let com2= "#C7F464";
let com3= "#FF6B6B";



fetch('https://data.abundis.com.mx/vista/json_scandir_h.php?MUID='+MUID).then(response => {
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
    
alert("NodeMinDegree:" + NodeMinDegree )
           
let drop_cont = 0; 
graph.nodes().forEach((node, i) => {
   
    //console.log(graph.degree(node));
    if (graph.degree(node) <= NodeMinDegree){
        drop_cont++; 
        graph.dropNode(node);
        console.log(drop_cont);
    } else {
        var nodetype = graph.getNodeAttributes(node)['nodetype']
        if (nodetype == "hashtag" ) {
            //graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 20) * 5);
            //graph.setNodeAttribute(node, 'size', (graph.inDegree(node)));
            graph.setNodeAttribute(node, 'size', ( graph.inDegree(node)  / 20 ) + 20 );
            graph.setNodeAttribute(node, 'color', com0);
        } else if (nodetype == "post") {
            graph.setNodeAttribute(node, 'size', 10);
            graph.setNodeAttribute(node, 'color', com1);
        } else if (nodetype == "user") {
            graph.setNodeAttribute(node, 'size', 15);
            graph.setNodeAttribute(node, 'color', com2);
        } else {
            graph.setNodeAttribute(node, 'size', (graph.inDegree(node) / 10) * 10);
            graph.setNodeAttribute(node, 'color', com4);
        }   
    }
});
            
console.log(drop_cont)}).then(function(){
console.log("ultima");
console.log("Densidad: " + graphologyLibrary.metrics.graph.density(graph));

const louvain =  new graphologyLibrary.communitiesLouvain(graph);
//console.log("Louvain: " + JSON.stringify( louvain )); 
graphologyLibrary.communitiesLouvain.assign(graph);
graphologyLibrary.layout.circular.assign(graph, {scale:2000});
const statsLouvain = graphologyLibrary.communitiesLouvain.detailed(graph);

graphologyLibrary.layoutForceAtlas2.assign(graph, {
  iterations: 5000,
  settings: {
      attraction: 3,
      repulsion: 2,      
      gravity: 5000,
      inertia: 1,
      maxMove: 2000,
      
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
      </div>
    </div>
  </div>
</div>
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

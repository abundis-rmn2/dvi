# DVI

## Overview

**DVI** (Data Visualization Interface) is a powerful tool for managing data and visualizing hashtag networks. It integrates with multiple related projects to streamline data mining, analysis, and visualization workflows. A core feature is the creation of **mining tasks**, each assigned a unique **Mining Unique Identifier (MUID)** that links tasks across all integrated tools.

---

## Features

- **CRUD Operations**: Perform Create, Read, Update, and Delete operations seamlessly.
- **Mining Tasks**: Generate tasks that integrate with:
  - [IDMB](https://github.com/abundis-rmn2/idmb): Scrapes hashtag conversations.
  - [Graffiti Detection OD TensorFlow](https://github.com/abundis-rmn2/Graffiti_Detection_OD_TensorFlow): Detects graffiti in image datasets.
  - [Hashtag Custom NER spaCy](https://github.com/abundis-rmn2/Hashtag_Custom_NER_spaCy): Analyzes mined hashtags.
- **MUID (Mining Unique Identifier)**: Links tasks across projects.
- **Graph Visualization**: Offers a dynamic interface for analyzing hashtag networks.
- **Customizable Visualization**: Modify graph parameters and filters to suit specific needs.
- **User-Friendly Interface**: Intuitive design for efficient task management.

---

## Project Structure

```
dvi/
├── database/          # Database-related files and configurations
├── db_actions/        # Scripts for database operations
├── docs/              # Documentation and resources
├── includes/          # Shared includes and utilities
├── json/              # JSON-related data and configurations
├── json_actions/      # Scripts for JSON data manipulation
├── block_data_live.php
├── db.php
├── delete_task.php
├── edit.php
├── functions.php
├── hashtags.php
├── hashtags_ai_data.php
├── hashtags_ai_data_live.php
├── header.php
├── index.php
├── json_data.php
├── json_hashtag.php
├── json_scandir.php
├── json_scandir_h.php
├── json_user.php
├── save_task.php
├── sigma.php
```

### Key Components

- **hashtags_ai_data_live.php**: Generates a JSON cache file representing hashtag network structures.  
  - Supports graph visualization workflows.  
  - Enables cleaning messy hashtag records dynamically.  
  - Visualization parameters can be adjusted via form inputs or left as defaults.  

---

## MUID Details

The **MUID** (Mining Unique Identifier) is a key feature of DVI. It is a compound identifier automatically generated for each mining task and serves as a transversal key across all related projects.

### MUID Structure

1. **Seed Node**: The main hashtag or entry point.  
   Example: `afeks`.

2. **Mining Depth**: Depth of the mining process (0 to 4).  
   Example: `1`.

3. **Mining Type**: Task type, such as:
   - `hashtagTop`: Extracts the most valuable posts for a hashtag.  
   Example: `hashtagTop`.

4. **Hashtag Media Amount**: Total number of media posts mined.  
   Example: `9`.

5. **Unique Hash**: A short, randomly generated hash ensuring uniqueness.  

### Example MUID
`afeks_1_hashtagTop_9_7052518d`

---

## Graph Visualization

All graph visualization features are managed in [hashtags_ai_data_live.php](https://github.com/abundis-rmn2/dvi/blob/main/hashtags_ai_data_live.php).  

The file is commented for clarity, and the visualization parameters can be modified as needed. Users can either provide custom values through the interface or rely on the defaults.

### Key Parameters

- **Graph Layout and Physics**:
  - `initialLayout`: Default is `circlepack`.
  - `autoGravityScale`: Default is `"auto"`.
  - `nodeMinDegree`: Default is `0`.
  - `gravity`: Default is `1`.
  - `iterations`: Default is `133`.
  - `scale`: Default is `5000`.

- **Node and Edge Behavior**:
  - `adjustSizes`: Default is `'false'`.
  - `cleanEntities`: Default is `'true'`.
  - `barnesHutOptimize`: Default is `'false'`.
  - `barnesHutTheta`: Default is `0.5`.

- **Network Filters**:
  - `networkfilter`: Default includes `"standard"`, `"text_ai"`, `"image_ai"`, and `"text_ai_entities"`.  
    Example: 
    ```php
    $networkfilter_get = isset($_GET['networkfilter']) ? $_GET['networkfilter'] : ["standard", "text_ai", "image_ai", "text_ai_entities"];
    ```

### Example Code Snippet
```php
$initialLayout = isset($_GET['initialLayout']) ? $_GET['initialLayout'] : "circlepack";
$nodeMinDegree = isset($_GET['nodeMinDegree']) ? $_GET['nodeMinDegree'] : 0;
$iterations = isset($_GET['iterations']) ? $_GET['iterations'] : 133;
```

---

## Installation

1. **Download the repository**:  
   Clone or download the ZIP file from the [repository](https://github.com/abundis-rmn2/dvi).

2. **Upload files to your server**:  
   Extract and upload to your desired FTP folder.

3. **Configure the database**:  
   Update `db.php` with your database credentials:
   ```php
   <?php
   session_start();

   $conn = mysqli_connect(
     '[SERVER]',
     '[DATABASE_USER]',
     '[DATABASE_PASSWORD]',
     '[DATABASE_NAME]'
   ) or die(mysqli_error($mysqli));
   ?>
   ```

4. **Access the application**:  
   Navigate to the uploaded folder in your browser:
   ```bash
   http://your-server-path/dvi
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to suggest edits or report issues in the [Issues](https://github.com/abundis-rmn2/dvi/issues) section!

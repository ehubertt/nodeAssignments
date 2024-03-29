// Emma Hubert
const getCrafts= async () => {
    try {
      return (await fetch("https://nodeassignments-1.onrender.com/api/crafts/")).json();
    } catch (error) {
      console.log(error);
    }
  };

const showCrafts = async () => {
  console.log("working");
  let crafts = await getCrafts();
  const craftsDiv = document.getElementById("row");
  craftsDiv.innerHTML = "";

  // Calculate number of columns (let's say 4 for this example)
  const numColumns = 4;
  const numRows = Math.ceil(crafts.length / numColumns);

  // Create an array to hold references to column elements
  const columns = [];

  // Create column elements and append them to the craftsDiv
  for (let i = 0; i < numColumns; i++) {
      const column = document.createElement("div");
      column.classList.add("column");
      craftsDiv.appendChild(column);
      columns.push(column);
  }

  // Populate columns with crafts
  crafts.forEach((craft, index) => {
      const columnIndex = index % numColumns; // Determine the column index for the current craft
      const column = columns[columnIndex]; // Get the column element for the current craft
      const craftDiv = document.createElement("div");
      craftDiv.classList.add("craft-item");

      // Display main image
      const mainImage = document.createElement("img");
      mainImage.className = "image";
      mainImage.src = craft.image;
      craftDiv.appendChild(mainImage); // Append to craftDiv
      
      // Add onclick event to show details
      mainImage.onclick = () => {
          displayDetails(craft);
      };

      // Append craftDiv to the appropriate column
      column.appendChild(craftDiv);
  });
};
  
  const displayDetails = (craft) => {
    openDialog("craft-details");
    
    const craftDetails = document.getElementById("craft-details");
    craftDetails.innerHTML = "";
    
  
    const flexSection = document.createElement("section");
    flexSection.classList = "flex-section";
    const flexDialogSection = document.createElement("section");

    // Display main image in the modal
    const mainImage = document.createElement("img");
    mainImage.className = "modal-image";
    mainImage.src = craft.image;
    mainImage.alt = craft.name;
    flexSection.appendChild(mainImage);
    

    // Add craft details to the modal
    const nameHeader = document.createElement("h2");
    nameHeader.textContent = craft.name;
    flexDialogSection.appendChild(nameHeader);

    // Display description
    const description = document.createElement("p");
    description.className = "description";
    description.innerHTML = `${craft.description}`;
    flexDialogSection.appendChild(description);

    // Display supplies
    const h3 = document.createElement("h3");
    h3.innerHTML = "Supplies:";
    flexDialogSection.appendChild(h3);
    const supplies = document.createElement("ul");
    craft.supplies.forEach((supply)=> {
        const li = document.createElement("li");
        li.innerHTML = supply;
        supplies.append(li);
    });
    supplies.className = "suppliesList";
    flexDialogSection.appendChild(supplies);
    flexSection.appendChild(flexDialogSection);
    craftDetails.appendChild(flexSection);
  };

  
  const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supply-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
  };
  
  const showCraftForm = (e) => {
    e.preventDefault();
    openDialog("add-craft-form");
    resetForm();
  };
  
  const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.classList.add("supply-box");
    input.type = "text";
    section.append(input);
  };
  
  const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
      item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
  };
  
  const addCraft = async(e)=> {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    formData.append("supplies", getSupplies());
    console.log(...formData);
  
    const response = await fetch("/api/crafts", {
        method:"POST",
        body:formData
    });
  
    if(response.status != 200){
        console.log("error posting data");
    }
  
    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showCrafts();
  
  };
  
  const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    const supplies = [];
  
    inputs.forEach((input)=>{
        supplies.push(input.value);
    });
  
    return supplies;
  }

  const cancel = () => {
    resetForm();
    document.getElementById("dialog").style.display = "none";
  }
 
 
  //on load
  showCrafts();
  document.getElementById("add-craft-form").onsubmit = addCraft;
  document.getElementById("add").onclick = showCraftForm;
  document.getElementById("add-supply").onclick = addSupply;
  document.getElementById("cancel").onclick = cancel;
  
  document.getElementById("img").onchange = (e) => {
    if (!e.target.files.length) {
      document.getElementById("img-prev").src = "";
      return;
    }
    document.getElementById("img-prev").src = URL.createObjectURL(
      e.target.files.item(0)
    );
  };

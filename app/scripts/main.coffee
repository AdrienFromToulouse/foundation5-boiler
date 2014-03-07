$(document).ready ->
  $("div.holder").jPages
    containerID: "itemContainer"
    perPage: 5
    keyBrowse: true
    scrollBrowse: true

  $("select#Itemsperpage").change ->
    
    # get new no of items per page 
    newPerPage = parseInt($(this).val())
    
    # destroy jPages and initiate plugin again 
    $("div.holder").jPages("destroy").jPages
      containerID: "itemContainer"
      perPage: newPerPage
  
    return

  $ ->
    $("#sales").dataTable()
    return

  return




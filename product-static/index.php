<!-- 
  This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
  Created by MRIDENE.
  Date: 01/02/2021
-->
<?php

$SITE_ROOT = "https://www.meduse.tn/";
$PRODUCT_STATIC = "https://meduse.tn/static/products/";

function getData($siteRoot) {

        $uri = $_SERVER['REQUEST_URI'];
        $id = explode("-" , explode("/", $uri)[2])[0];
        $rawData = file_get_contents($siteRoot.'api/products/'.$id);
        $data = json_decode($rawData);
        return $data->product;
}

$jsonData = getData($SITE_ROOT);
$imageUrl = $PRODUCT_STATIC . explode(",", $jsonData->images)[0];
$title = $jsonData->label;
$description = $jsonData->description;

echo "<!DOCTYPE html>";
echo "<html>";

echo "<head>";
echo "<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">";
echo "<meta property=\"og:type\" content=\"website\">";
echo "<meta property=\"fb:app_id\" content=\"227189032141937\">";
echo "<meta property=\"og:title\" content=\"" . $title . "\" >";
echo "<meta property=\"og:description\" content=\"" . $description . "\">";
echo "<meta property=\"og:image\" content=\"" . $imageUrl . "\" >";
echo "</head>";

echo "<body>";
echo "<p>" . $description . "</p>";
echo "<img src='" . $imageUrl . "'>";
echo "</body>";

echo "</html>";
?>
<?php
  $txt = 'Новая заявка! %0A';
  $name = $_POST['name'];
  $phone = $_POST['phone'];
  $email = $_POST['email'];
  var_dump($_POST);
  $token = "7812692171:AAE1hOq8p_REUdHr34yAkCZ71qWSRFBGmoM";
  $chat_id = "-4822114050";
  $arr = array(
    'Имя: ' => $name,
    'Телефон: ' => $phone,
    'Почта: ' => $email,
  );
  
  foreach($arr as $key => $value) {
    $txt .= "<b>".$key."</b> ".$value."%0A";
  };
  
  $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");
  
  if ($sendToTelegram) {
    header('Location: thank-you.html');
  } else {
    echo "Error";
  }
?>
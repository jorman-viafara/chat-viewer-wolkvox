
<?php

$placa = isset($placaCliente) ? strval($placaCliente) : 'JDE96G';
$numero = isset($cust_phone) ? strval($cust_phone) : '3233478550';
$cedula = isset($documentoCliente) ? strval($documentoCliente) : '1111479273';
$nombre = isset($nombreClienteSolo) ? strval($nombreClienteSolo) : 'Jorman Stiv';
$apellido = isset($apellidoCliente) ? strval($apellidoCliente) : 'Viafara';
$nombreCompleto = trim($nombre . ' ' . $apellido);

$url = "https://prod-14.brazilsouth.logic.azure.com:443/workflows/5d7f2d4f0ec747488c3af3fd7cd8f964/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NhD3SEJIabfa2atiagyeDeAvZuOCUPblWczW63hEe6Y";

$data = [
    "venta" => "true",
    "numeroTelefono" => $numero,
    "cedula" => $cedula,
    "nombre" => $nombreCompleto,
    "placa" => $placa,
];

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error_message = null;
$server_response = null;

if (curl_errno($ch)) {
    $curl_error_message = 'cURL Error: ' . curl_error($ch);
} elseif ($http_code >= 400) {
    $curl_error_message = 'HTTP Error: ' . $http_code;
} else {
    $server_response = $response;
}

curl_close($ch);
?>

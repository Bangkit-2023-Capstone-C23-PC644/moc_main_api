
# Medical Overseer Control (MOC) API

MOC is a cloud native android app that can monitor hospital's estimated queue, crowdness, or activity. It uses cutting edge machine learning model to automatically detect hospital's activity through a CCTV camera. The MOC API are hosted on the Google Cloud Platform, making it secure, highly-available, and scalable.




## Authors

- [Doni Febrian](https://www.github.com/peepeeyanto)
- [Alvan Alfiansyah](https://www.github.com/alvansoleh)


## Deployment

To deploy this project you can clone this project through GCP's cloud shell, and then deploy it easily through GCP's App Engine using

```bash
  gcloud app deploy
```
Make sure to change the .env files accordingly beforehand!

For the database we're using mysql, so you can create a mysql instance using GCP's SQL, or host your own. After you've created your instance you can import our database schema (mocset1.sql) using a GUI like mysql workbench, phpmyadmin, heidisql, or you can also do a query in your mysql client using
```
    mysql -u username -p new_database < mocset1.sql

```


## API Reference

#### Register user
For registering user
```http
  POST /register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `NIK` | `string` | **Required**. Your 16-digit NIK |
|`name`|`string`|**Required**. Your first and last name|
|`email`|`string`|**Required**. Your email account|
|`phone`|`string`|**Required**. Your phone number|
|`password`|`string`|**Required**. Your Password. must be at least 6 characters|
|`lintang`|`string`|**Required**. Your location's latitude according to google maps|
|`bujur`|`string`|**Required**. your location's latitude according to google maps|

#### Login User
For logging in as a user and getting that user's JWT token
```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nik`      | `string` | **Required**. your 16-digit nik |
| `password`      | `string` | **Required**. your password |

#### Nearest Hospitals
For getting all hospital's brief info and sorting it by user's distance **Requires user's JWT token**
```http
  GET /nearest 
```

#### Shortest hospitals
Get all hospital's brief info and sorting them by specified distance
```http
  POST /shortest
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|`latitude`|`string`|**Required**. Your coordinate's latitude according to google maps|
|`longitude`|`string`|**Required**. Your coordinate's longitude according to google maps|

#### Getting hospitals details
For getting hospital's detailed information including the hospital's crowdness and estimated queue
```http
    GET /hospitals/{hospitalID}
```
#### Registering your own hospital
For registering your hospital so that it can be displayed
```http
    POST /rsregister/
```

| Field                            | Type   | Description                                      |
|----------------------------------|--------|--------------------------------------------------|
| hospitalID                       | String | **Required**. Unique identifier for the hospital                |
| namaRS                           | String | **Required**. Name of the hospital                              |
| alamat                           | String | **Required**. Address of the hospital                           |
| lintang                          | String | **Required**. Latitude of the hospital location                 |
| bujur                            | String | **Required**. Longitude of the hospital location                |
| kemampuan_penyelenggaraan        | String | Capability of hospital's services                 |
| status_akreditasi                | String | Accreditation status of the hospital              |
| jumlah_tempat_tidur_perawatan_umum       | String | Number of general ward beds                  |
| jumlah_tempat_tidur_perawatan_persalinan | String | Number of maternity ward beds                |
| jml_dokter_umum                  | String | Number of general practitioners                   |
| jml_dokter_gigi                  | String | Number of dentists                                |
| jml_perawat                      | String | Number of nurses                                  |
| jml_bidan                        | String | Number of midwives                                |
| jml_ahli_gizi                    | String | Number of dietitians/nutritionists                |
| password                         | String | **Required**. Your password. It must be 6 characters or more |

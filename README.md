
# Medical Overseer Control (MOC) API

MOC is a cloud native android app that can monitor hospital's estimated queue, crowdness, or activity. It uses cutting edge machine learning model to automatically detect hospital's activity through a CCTV camera. The MOC API is powered by express.js framework and mysql database which is both reliable and easy to develop. This API are hosted on the Google Cloud Platform, making it secure, highly-available, and scalable. 




## Authors

- [Doni Febrian](https://www.github.com/peepeeyanto)
- [Alvan Alfiansyah](https://www.github.com/alvansoleh)


## Deployment

To deploy this project you can clone this project through GCP's cloud shell, and then deploy it easily through GCP's App Engine using

```bash
  gcloud app deploy
```
Make sure to make a .env file with these variables before you deploy your API!
| ENV variables | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `DB_HOST`      | `string` | **Required**. your database IP address |
| `DB_USER`      | `string` | **Required**. your database username |
| `DB_PASS`      | `string` | **Required**. your database password |
| `SECRET_USER`      | `string` | **Required**. your secret key for signing the user's JWT token |
| `SECRET_RS`      | `string` | **Required**. your secret key for signing the hospital's JWT token |
| `PORT`      | `string` | **Required**. your prefered port for running the API. If you're using the app engine it's best to use port 8080 |
| `ML_LINK`      | `string` | **Required**. HTTP link to the your deployed MOC ML API |

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

| Field | Type     | Description                |
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

| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nik`      | `string` | **Required**. your 16-digit nik |
| `password`      | `string` | **Required**. your password |

#### Nearest Hospitals
For getting all hospital's brief info and sorting it by user's distance **Requires user's JWT token**
```http
  GET /nearest 
```

#### Getting hospitals details
For getting hospital's detailed information including the hospital's crowdness and estimated queue **Requires user's JWT token**
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
| lintang                          | String | **Required**. Latitude of the hospital location (e.g -6.326645)              |
| bujur                            | String | **Required**. Longitude of the hospital location (e.g 106.861029)               |
| kemampuan_penyelenggaraan        | String | Capability of hospital's services (1 if if your hospital has inpatient services and 0 if not)               |
| status_akreditasi                | String | Accreditation status of the hospital (0 if none, 1 if in process, 2 if it has it)             |
| jumlah_tempat_tidur_perawatan_umum       | String | Number of general ward beds                  |
| jumlah_tempat_tidur_perawatan_persalinan | String | Number of maternity ward beds                |
| jml_dokter_umum                  | String | Number of general practitioners                   |
| jml_dokter_gigi                  | String | Number of dentists                                |
| jml_perawat                      | String | Number of nurses                                  |
| jml_bidan                        | String | Number of midwives                                |
| jml_ahli_gizi                    | String | Number of dietitians/nutritionists                |
| password                         | String | **Required**. Your password. It must be 6 characters or more |
| quota_ruang_tunggu                         | String | **Required**. Your waiting room estimated maximum number of people before it become very crowded |

#### Login hospital
For logging in as hospital admin and getting that hospital's JWT token
```http
    POST /rslogin/
```

| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `hospitalID`      | `string` | **Required**. your 7 digit hospital ID |
| `password`      | `string` | **Required**. your password |

#### Machine Learning model
For loading your images to our ML model and then update the database accordingly **Requires hospital's JWT token**
```http
    POST /ml/
```
| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `file`      | `JPEG/PNG image` | **Required**. your image that needs to be processed through our ML Model |

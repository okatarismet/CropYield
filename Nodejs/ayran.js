const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool
const checkAuth = require('../middleware/check-auth')
const validator = require('validator');
const pool = new Pool({
  user: 'postgres',
  host: '195.201.19.95',
  database: 'postgres',
  password: 'Ismo44',
  port: 5432,
})

function addRate(rated_type, rated_id, rate, rater_id, title_id){
  if(rated_id == rater_id){
    console.log("You can't rate yourself");
    return "You can't rate yourself";
  }
  let title_id2;
  if(rated_type == 2 || rated_type == 3){
    title_id2 = null;
  } else {
    title_id2 = title_id;
  }
  pool.query(
        'select u.gizli from users u WHERE id = $1',
        [rater_id],
        (error, result3) => {
    if (error) {
      console.log("Postgresql Error : "+error);
      return 'Error : First query cannot be done';
    }
    else {
      console.log("Asking is Person Hidden : " + result3.rows[0].gizli);
      hidden = result3.rows[0].gizli;
      console.log(hidden);
      if(rated_type == 1){
        if(title_id2 == null){
          return "cannot find title_id";
        }
      }
      pool.query(`INSERT INTO rates (
            rated_type,
            rated_id,
            rate,
            rater_id,
            hidden,
            title_id
            ) VALUES ($1, $2, $3, $4, $5, $6) returning id`, [
              rated_type,
              rated_id,
              rate,
              rater_id,
              hidden,
              title_id2
            ], (error, result) => {
        if (error) {
          console.log("Postgresql Error : "+error);
          return error;
        }
        else {
          console.log("Rate " + rate + " is added")
          return "success";
        }
      });
    }
  })
}

function addRateOLD(rated_type, rated_id, rate, rater_id){

  pool.query(`INSERT INTO rates (
    rated_type,
    rated_id,
    rate,
    rater_id
    ) VALUES ($1, $2,$3, $4) returning id`, [
      rated_type,
      rated_id,
      rate,
      rater_id
    ], (error, result) => {
      if (error) {
        console.log("Postgresql Error : "+error);
        return error;
      }
      else {
        console.log("Rate " + rate + " is added")
        return "success";
      }
    });
}

/**
 * Used for add a new element
 *   input: has to contain all fields in body
 *   returns: the id of the newly created element
 */
/**
 * author: ismet
 * TO-DO: validate all types of body
 */
router.post('/user',checkAuth,(req,res,next)=>{
    const {
        rater_id,
        rate,
        fname,
        lname,
        birthdate,
        created,
        updated,
        sex,
        place,
        title_id,
        company_id
        } = req.body
    if(!(fname && lname && sex && place && title_id && rate && rater_id)){
    //  return res.status(400).json({
    //    message: `body has to contain  fname,lname,birthdate,created,updated,sex,place,title_id,company_id one of them is either not passed or have a null value.`
    //  })
      res.status(401).send("body has to contain  fname,lname,birthdate,created,updated,sex,place,title_id,rate,rater_id one of them is either not passed or have a null value.");
      return;
    }
    pool.query(`INSERT INTO users (
        fname,
        lname,
        birthdate,
        created,
        updated,
        sex,
        place
        ) VALUES ($1, $2,$3, $4,$5, $6,$7) returning id`, [
        fname,
        lname,
        birthdate,
        created,
        updated,
        sex,
        place
        ], (error, result) => {
      if (error) {
        console.log("Postgresql Error : "+error);
        return res.status(400).json({error:error});
      }
      else {
        console.log("User Added with ID: "+result.rows[0].id);
        pool.query("Insert into user_title (user_id, title_id, company_id) values ($1, $2, $3)",[result.rows[0].id,title_id, company_id],(error2, result2)=>{
          if(error){
            console.log(error)
            return res.status(403).send('Cannot Add');
          } else {
            console.log("title added.")
          }
        })
        console.log
        addRate(1, result.rows[0].id, 5, 0, title_id);
        addRate(1, result.rows[0].id, rate, title_id);
        res.status(201).json({id:result.rows[0].id})
      }
    })
})

router.post('/brand',checkAuth,(req,res,next)=>{
    const {
      rate,
      rater_id,
      name,
      created,
      updated
      } = req.body
    if(!(name && created && updated)){
      //return res.status(400).json({ message: `body has to contain  name, created, updated. One of them is either not passed or have a null value.` })
      res.writeHead(400);
      res.end("body has to contain  name, created, updated. One of them is either not passed or have a null value.");
      return;
    }

    pool.query(`INSERT INTO brand (
        name,
        created,
        updated
        ) VALUES ($1, $2,$3) returning id`, [
        name,
        created,
        updated
        ], (error, result) => {
      if (error) {
        console.log("Postgresql Error : "+error);
        return res.status(400).json({error:error});
      }
      else {
        console.log("Brand Added with ID: "+result.rows[0].id)
        addRate(2, result.rows[0].id, 5, 0);
        addRate(2, result.rows[0].id, rate, rater_id);
        res.status(201).json({id:result.rows[0].id})
      }
    })
})

router.post('/company',checkAuth,(req,res,next)=>{
    const {
      rate,
      rater_id,
      name,
      created,
      updated,
      place
      } = req.body
    if(!(name && created && updated && place)){
      return res.status(400).json({
        message: `body has to contain  name,created,updated,place. one of them is either not passed or have a null value.`
      })
    }

    pool.query(`INSERT INTO company (
        name,
        created,
        updated,
        place
        ) VALUES ($1, $2,$3, $4) returning id`, [
        name,
        created,
        updated,
        place
        ], (error, result) => {
      if (error) {
        console.log("Postgresql Error : "+error);
        return res.status(400).json({error:error});
      }
      else {
        console.log("Company Added with ID: "+result.rows[0].id)
        addRate(3, result.rows[0].id, 5, 0);
        addRate(3, result.rows[0].id, rate, rater_id);
        res.status(201).json({id:result.rows[0].id})
      }
    })
})

router.post('/title',checkAuth,(req,res,next)=>{
  const {desc} = req.body
  if(!desc){
    return res.status(400).json({
      message: "body has to contain desc. desc is either not passed or have a null value."
    })
  }

  pool.query(`INSERT INTO public.title ("desc") VALUES ($1) returning id`, [desc], (error, result) => {
    if (error) {
      console.log("Postgresql Error : "+error);
      return res.status(400).json({error:error});
    }
    else {
      console.log("Title Added with ID: "+result.rows[0].id)
      res.status(201).json({id:result.rows[0].id})
    }
  })
})

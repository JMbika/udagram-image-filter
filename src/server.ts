import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  //    1. validate the image_url query
  //from https://stackoverflow.com/questions/30970068/js-regex-url-validation/30970319
  const validateImageUrl = async (imageUrl:string) => {
    var res = imageUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null){
      return false;
    } else
      return true;
  }

  // GET /filteredimage?image_url={{URL}}
  // from https://knowledge.udacity.com/questions/166155 g
  app.get("/filteredimage", async (req, res) => {
    let { image_url } = req.query;
    let validUrl = await validateImageUrl(image_url);
    if(!validUrl) {
      return res.status(400).send('invalid url!');
    }
    try {
      let filteredpath = await filterImageFromURL(image_url);
      res.sendFile(filteredpath, async () => {
        await deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      return res.status(400).send(JSON.stringify(error));
    }
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
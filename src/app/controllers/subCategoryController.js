const express = require( 'express' )

const Category = require( '../models/category' )

const router = express.Router()

const deleteSubCategories = async ( req, res ) => {
  try {
    const { subCategoryIds } = req.body

    await Category.deleteMany( { _id: { $in: subCategoryIds } } )

    return res.send( { deletedCount: subCategoryIds.length } )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on deleting subCategories: ${e}` } )
  }
}

router.delete( '/', deleteSubCategories )

module.exports = ( app ) => app.use( '/sub-categories', router )

const Listing = require('../models/listing')

const index = async (req, res) => {
    try {
        const listings = await Listing.find().populate('owner');
        res.render('listings/index.ejs', {
            title: 'Listings',
            listings: listings,
        });

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

const newListing = (req, res) => {
    try {
        res.render('listings/new.ejs', {
            title: 'Add Listings'
        })

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}


const createListing = async (req, res) => {
    try {
        // req.body.owner = req.session.user._id;
        req.body.owner = req.params.userId;
        await Listing.create(req.body)
        console.log(req.body);
        res.redirect('/listings')
        
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}

const show = async (req, res) => {
    try {
        console.log("show: ", req.params.listingId);
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        res.render('listings/show.ejs', {
            title: 'Listing',
            listing,
        })
        console.log(listing);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}


const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
        
        if (listing.owner.equals(req.params.userId)) {// checks if the signedd in user and listing down owner are the same
            await listing.deleteOne() //delete the listing
            res.redirect('/listings')
        } else{
            res.send("You don't have permission to do that.")
        }

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

const edit = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        if(listing.owner.equals(req.params.userId)){
        res.render('listings/edit.ejs', {
            title: `Edit ${listing.streetAddress}`,
            listing,
        })
    } else {
        res.send("You don't have permission to do that.")
    }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

const update = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.listingId,
            req.body,
            {new: true}
        )
        res.redirect(`/listings/${listing._id}`)

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
module.exports = {
    index,
    newListing,
    createListing,
    show,
    deleteListing,
    edit,
    update,
}
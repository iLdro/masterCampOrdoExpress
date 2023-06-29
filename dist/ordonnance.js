const Ordonnance = require('../model/ordonnance');
const Doc = require('../model/doc');

const getOrdonnance = async (req, res) => {
    var id = req.body.id;
    try {
        var ordonnance = await Ordonnance.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }

        var currentDate = new Date();
        var ordonnanceDate = new Date(ordonnance.dateDeCréation);

        var threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        console.log(threeMonthsAgo)

        if (ordonnanceDate < threeMonthsAgo) {
            ordonnance.expired = true;
            await ordonnance.save();
        }

        const ordonnanceObject = ordonnance.toObject();
        res.status(200).json(ordonnanceObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getImages = async (req, res) => {
    var id = req.body.id;
    try {
        id = new Object(id);
        var ordonnance = await Doc.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }
        else {
            res.status(200).json(ordonnance);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const createOrdonnance = async (req, res) => {
    const {user_id, medecin_id, medicaments } = req.body;
    const ordonnance = new Ordonnance({
        user_id: user_id,
        medecin_id: medecin_id,
        medicaments: medicaments,
        pharmacien_id: null,
        dateDeCréation: Date.now(),
        expired: false,
    });
    try {
        const newOrdonnance = await ordonnance.save();
        res.status(201).json(newOrdonnance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}





module.exports = { getOrdonnance, getImages };


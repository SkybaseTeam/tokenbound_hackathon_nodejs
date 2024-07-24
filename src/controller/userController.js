import { tbaModel } from '../models/tbaModel.js';
import { formatStarknet } from '../utils/index.js';

export const tba = async (req, res) => {
  try {
    const address = formatStarknet(req.params.address).toLowerCase();
    const { page, limit, listing } = req.query;

    let userData;
    let totalCount;
    let hasMore;

    if (page && limit) {
      const skip = (page - 1) * limit;

      userData = await tbaModel
        .find({
          owner_address: address,
          listing: listing || { $ne: null },
        })
        .skip(skip)
        .limit(limit);

      totalCount = await tbaModel.countDocuments({
        owner_address: address,
        listing: listing || { $ne: null },
      });
      hasMore = page * limit < totalCount;
    } else {
      userData = await tbaModel.find({
        owner_address: address,
        listing: listing || { $ne: null },
      });
      hasMore = false;
    }

    /* Done */
    res.status(200).json({
      message: 'Get profile success',
      data: userData,
      pagination: {
        currentPage: page,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

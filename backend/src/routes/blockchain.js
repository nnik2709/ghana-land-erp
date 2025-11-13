const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/transactions', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const transactions = db.prepare('SELECT * FROM blockchain_transactions ORDER BY timestamp DESC LIMIT 50').all();

    res.json({
      success: true,
      data: transactions,
      blockchain_info: {
        network: 'Hyperledger Fabric',
        consensus: 'RAFT',
        current_block: 12500,
        total_transactions: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/token/:token_id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const transactions = db.prepare('SELECT * FROM blockchain_transactions WHERE token_id = ? ORDER BY timestamp DESC').all(req.params.token_id);

    const parcel = db.prepare('SELECT * FROM parcels WHERE blockchain_token_id = ?').get(req.params.token_id);

    res.json({
      success: true,
      data: {
        token_id: req.params.token_id,
        parcel,
        transactions,
        metadata: {
          total_transactions: transactions.length,
          first_transaction: transactions[transactions.length - 1]?.timestamp,
          last_transaction: transactions[0]?.timestamp
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/mint', authenticate, authorize('admin', 'lands_officer'), (req, res) => {
  try {
    const { token_id, parcel_id, owner_id } = req.body;
    const db = getDatabase();

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const blockNumber = Math.floor(Math.random() * 1000) + 12000;

    db.prepare(`
      INSERT INTO blockchain_transactions (id, transaction_hash, block_number, token_id, transaction_type, to_address, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), txHash, blockNumber, token_id, 'MINT', owner_id, JSON.stringify({ parcel_id }));

    res.status(201).json({
      success: true,
      message: 'Token minted successfully',
      data: { transaction_hash: txHash, block_number: blockNumber }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

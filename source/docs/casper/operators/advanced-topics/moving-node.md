This is a description of my backup node cutover tests for an active validator using 1.4.1 casper-node.

# Setup

Created two nodes and key sets.   We will call these `val` and `backup`.

I copied both keys to /etc/casper/validator_keys/ under val or backup directories.  

 * /etc/casper/validator_keys
   * public_key_hex
   * public_key.pem
   * secret_key.pem
   * val
     * public_key_hex
     * public_key.pem
     * secret_key.pem
   * backup
     * public_key_hex
     * public_key.pem
     * secret_key.pem

This allows going into `val` or `backup` and doing a `sudo -u casper cp * ../` to "enable" that node to be that key.

Synced both to tip.  Bonded in the val key and waited until rewards were issued.

# Swapping which node is the active validator

On the current validator (future backup):
```
sudo systemctl stop casper-node-launcher on current val
cd /etc/casper/validator_keys/backup
sudo -u casper cp * ../
```

On the current backup (future validator):
```
sudo systemctl stop casper-node-launcher on current backup
cd /etc/casper/validator_keys/val
sudo -u casper cp * ../
sudo systemctl start casper-node-launcher  (now as val)
```

Back on the old validator (new backup):
```
sudo systemctl start casper-node-launcher 
```

# Rewards Cost

I noticed that the validator node shows no round length until an Era transition occurs.  It is not ejected, but it does not continue to receive rewards until the next era.   So if there is a choice for when to do this, you want to time it to just before the era ends.

It seems you lose all rewards from the point of the switch till the end of that Era.  Rewards are then normal in the next Era.

# Permissions

Make sure permissions are good.  `/etc/casper/node_util.py` has methods to check and fix file permissions after moves.
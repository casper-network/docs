# Theory

This is version 3.0 of technical specification and it corresponds to April 2020 release of our platform ("Alpha Testnet").

To build a proof-of-stake blockchain, one must follow this general recipe:

> 1.  Pick the core consensus protocol (a machinery that allows to do distributed selection of one element from a finite set).
> 2.  Pick the model of transactions ledger (transactions and blocks structure show up here).
> 3.  Apply the core consensus to the ledger, i.e. establish consensus-based way of extending the ledger by blockchain participants. Ensure that liveness theorem can be proven for the resulting design.
> 4.  Plug-in stakes management solution.
> 5.  Plug-in the suitable computing model (i.e. smart contracts virtual machine).

The "Theory" chapter explains how we approached steps (1) \... (4) in the abstract way, while implementation-level details are specified in "Casper Blockchain Design" chapter. The outline of material presented is:

-   **Abstract Casper Consensus** - presents the core consensus protocol we use; concepts such as estimator, finality and fault-tolerance threshold and summits are explained
-   **Brickdag** - introduces the transactions ledger structure - bricks, blocks, ballots, parents tree and justifications graph
-   **Leaders and rounds** - explains the mechanics of "Flat Highway", i.e. when the set of validators is fixed
-   **Fork choice and finality** - applies the abstract Casper consensus to the brickdag
-   **Eras** - describes how we do stake management in Highway
-   **Known limitations and features planned for ver 4.0** - sketches changes we anticipate to hit version 4.0 of this spec

## Research trace

The consensus solution used in Casper blockchain is a latest achievement of a research path that can be traced back to the 1980's. Important milestones on this path are:

-   1980: The problem of byzantine consensus defined (Lamport, Shostak)
-   1985: Impossibility of distributed consensus with one faulty process theorem (Fischer, Lynch, Paterson)
-   1997: Proof-of-Work invented (Hashcash system)
-   1999: "Practical Byzantine Fault Tolerance" (PBFT) algorithm (Castro, Liskov)
-   2008: Bitcoin invented (Satoshi Nakamoto)
-   2012: First proof-of-stake cryptocurrency system created (Peercoin system)
-   2013: Ethereum invented - cryptocurrency idea generalized to a decentralized general-purpose computing platform (Vitalik Buterin)
-   2013: "Greedy Heaviest Observed Subtree" (GHOST) algorithm introduced (Sompolinsky, Zohar)
-   2015: Blockchain idea extended to "block DAG" - "Inclusive Block Chain Protocols" (Lewenberg, Sompolinsky, Zohar)
-   2017: First draft version of Casper protocol spec published (Ethereum research group, Vlad Zamfir)
-   Jul 2018: First implementation of proof-of-stake blockchain built on Casper-GHOST-Blockdag combination attempted
-   Dec 2018: CBC Casper protocol 1.0 specification (Ethereum research group, Vlad Zamfir)
-   Sep 2019: Highway Protocol (Daniel Kane, Vlad Zamfir, Andreas Fackler)

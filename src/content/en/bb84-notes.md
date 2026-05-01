---
title: "BB84 QKD Notes"
description: "A compact note on the BB84 quantum key distribution protocol and the ideas that make eavesdropping detectable."
date: "2023-04-23"
tags: ["Quantum", "Protocol", "Class Work"]
category: "Quantum"
---

## The idea

BB84 is a quantum key distribution protocol proposed by Charles Bennett and Gilles Brassard in 1984. The charming part is that it does not make eavesdropping impossible. It makes eavesdropping visible.

Alice sends qubits using randomly chosen bases. Bob measures them using randomly chosen bases too. Later, they compare only the bases, not the measured secret bits.

## Why it works

When Bob chooses the same basis as Alice, the measured bit can be used as part of the shared key. When the basis differs, the measurement is discarded.

An eavesdropper has the same problem as Bob: choosing the wrong basis changes the quantum state. That disturbance appears as errors when Alice and Bob compare a sample of their bits.

## Mental model

The protocol is a neat reminder that security can come from physics, not only from computational difficulty. The channel does not need to be trusted blindly; it can be tested.

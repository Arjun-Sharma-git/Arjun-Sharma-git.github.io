# Fewest payments, in Lean 4

A machine-checked proof of the theorem Reductxn's settle-up engine relies on. The proof is in
[`SettleUp/Basic.lean`](SettleUp/Basic.lean).

## What is proved

`SettleUp.fewest_payments`: for integer balances `b` over a finite set of people, with `∑ b = 0`,

```lean
IsLeast {m | ∃ p, (∀ t ∈ p, t.Valid) ∧ Settles p b ∧ p.length = m}
  ((support b).card - maxBlocks b)
```

So `n - k` valid transfers settle everyone, and no plan does it in fewer.

- `support b` is the people with a non-zero balance, so its size is `n`.
- `maxBlocks b` is `k`: the most blocks those people can be split into with every block summing to zero.
- A `Valid` transfer goes between two different people, for a positive amount.
- `Settles p b` means every person's net receipts under the plan equal their balance.

`lower_bound` is stronger than the theorem needs: it holds for any plan, valid or not.

## What is not proved

- That the Java `NettingEngine` is correct. This proves the mathematics it relies on, not its code. The engine's
  own tests compare it with an independent brute force.
- Anything about the greedy plan used above 20 people. The engine does not claim that plan is minimal unless it
  meets the lower bound.
- Anything about the choice between equally short plans by estimated cost.

## Check it

Needs [elan](https://github.com/leanprover/elan). Versions are pinned: Lean and Mathlib `v4.35.0`.

```bash
lake exe cache get
lake build
```

The build prints what the theorem depends on, which is only Lean's standard axioms:

```text
'SettleUp.fewest_payments' depends on axioms: [propext, Classical.choice, Quot.sound]
```

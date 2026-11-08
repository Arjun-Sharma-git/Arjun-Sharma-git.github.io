import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{T as t,i as n,o as r,q as i,y as a}from"./layout-C-kgaK_J.js";import{t as o}from"./index-Q7iwZyp2.js";import{n as s,t as c}from"./Contact-Lh_AhowL.js";import{a as l,i as u,n as d,s as f}from"./shared-CRcSwHHj.js";var p=e(i(),1),m=`/-
Fewest payments to settle a group.

For integer balances \`b\` summing to zero, let \`n\` be the number of people with a non-zero balance and
\`k\` the most blocks those people can be split into so that every block sums to zero. The fewest positive
transfers that settle everyone is exactly \`n - k\`. See \`fewest_payments\` at the end of this file.

The argument:

* Lower bound. Start with everyone in a block of their own. Each transfer merges at most two blocks, and
  blocks stay zero-sum under what the plan has moved so far. So a plan of \`m\` transfers leaves at least
  \`n - m\` zero-sum blocks of the people it settles, which is at most \`k\`.
* Achievability. A zero-sum block of \`s\` people settles in at most \`s - 1\` transfers: one person clears
  their whole balance against another, and the block shrinks by one.
-/
import Mathlib

open Finset

namespace SettleUp

variable {V : Type*} [DecidableEq V]

/-- One payment of \`amount\` from \`payer\` to \`payee\`. -/
structure Transfer (V : Type*) where
  payer : V
  payee : V
  amount : ℤ

/-- A real payment: between two different people, for a positive amount. -/
def Transfer.Valid (t : Transfer V) : Prop := t.payer ≠ t.payee ∧ 0 < t.amount

/-- What a transfer does to \`v\`'s position. -/
def Transfer.effect (t : Transfer V) (v : V) : ℤ :=
  (if v = t.payee then t.amount else 0) - (if v = t.payer then t.amount else 0)

/-- Net amount \`v\` receives over a plan. -/
def received (p : List (Transfer V)) (v : V) : ℤ := (p.map fun t => t.effect v).sum

/-- A plan settles \`b\` when everyone receives exactly what they are owed (\`b v < 0\` means \`v\` owes). -/
def Settles (p : List (Transfer V)) (b : V → ℤ) : Prop := ∀ v, received p v = b v

@[simp] lemma received_nil (v : V) : received ([] : List (Transfer V)) v = 0 := rfl

@[simp] lemma received_cons (t : Transfer V) (p : List (Transfer V)) (v : V) :
    received (t :: p) v = t.effect v + received p v := by
  simp [received]

lemma received_append (p q : List (Transfer V)) (v : V) :
    received (p ++ q) v = received p v + received q v := by
  simp [received]

/-- A transfer only moves money between its two ends, so a set holding both ends is unchanged. -/
lemma sum_effect (t : Transfer V) (S : Finset V) :
    ∑ v ∈ S, t.effect v =
      (if t.payee ∈ S then t.amount else 0) - (if t.payer ∈ S then t.amount else 0) := by
  simp [Transfer.effect, sum_sub_distrib, sum_ite_eq']

/-- The classes of a colouring of \`S\`, as a partition of \`S\`. -/
def partitionOf {C : Type*} [DecidableEq C] (S : Finset V) (f : V → C) : Finpartition S where
  parts := (S.image f).image fun c => S.filter fun v => f v = c
  supIndep := by
    rw [Finset.supIndep_iff_pairwiseDisjoint]
    intro A hA B hB hAB
    simp only [coe_image, Set.mem_image, mem_coe] at hA hB
    obtain ⟨c, -, rfl⟩ := hA
    obtain ⟨d, -, rfl⟩ := hB
    refine Finset.disjoint_left.2 fun v hv hv' => hAB ?_
    have hc := (mem_filter.1 hv).2
    have hd := (mem_filter.1 hv').2
    rw [← hc, ← hd]
  sup_parts := by
    ext v
    simp only [mem_sup, mem_image, id, exists_exists_and_eq_and, mem_filter]
    constructor
    · rintro ⟨_, _, hv, -⟩
      exact hv
    · intro hv
      exact ⟨v, hv, hv, rfl⟩
  bot_notMem := by
    simp only [bot_eq_empty, mem_image, not_exists, not_and]
    rintro c ⟨v, hv, rfl⟩ h
    have : v ∈ S.filter fun w => f w = f v := mem_filter.2 ⟨hv, rfl⟩
    simp [h] at this

lemma card_parts_partitionOf {C : Type*} [DecidableEq C] (S : Finset V) (f : V → C) :
    (partitionOf S f).parts.card = (S.image f).card := by
  refine card_image_of_injOn ?_
  intro c hc d _ h
  obtain ⟨v, hv, rfl⟩ := mem_image.1 (mem_coe.1 hc)
  have : v ∈ S.filter fun w => f w = d := by
    have hv' : v ∈ S.filter fun w => f w = f v := mem_filter.2 ⟨hv, rfl⟩
    simpa [h] using hv'
  exact (mem_filter.1 this).2

/-! ### Achievability -/

/-- A zero-sum block of \`n + 1\` people settles in at most \`n\` valid transfers, touching nobody else. -/
lemma settle_block (n : ℕ) : ∀ (B : Finset V) (b : V → ℤ), B.card = n + 1 → ∑ v ∈ B, b v = 0 →
    ∃ p : List (Transfer V), (∀ t ∈ p, t.Valid) ∧
      (∀ v, received p v = if v ∈ B then b v else 0) ∧ p.length ≤ n := by
  induction n with
  | zero =>
    intro B b hB hsum
    obtain ⟨a, rfl⟩ := card_eq_one.1 hB
    refine ⟨[], by simp, fun v => ?_, by simp⟩
    by_cases h : v = a
    · subst h
      simpa using hsum.symm
    · simp [h]
  | succ n ih =>
    intro B b hB hsum
    obtain ⟨a, ha, c, hc, hac⟩ := one_lt_card.1 (by omega : 1 < B.card)
    -- \`a\` clears their whole balance against \`c\`, leaving a zero-sum block without \`a\`.
    let b' : V → ℤ := fun v => if v = c then b c + b a else b v
    have hc' : c ∈ B.erase a := mem_erase.2 ⟨hac.symm, hc⟩
    have hsum' : ∑ v ∈ B.erase a, b' v = 0 := by
      have h1 : ∑ v ∈ B.erase a, b' v = ∑ v ∈ B.erase a, (b v + if v = c then b a else 0) := by
        refine sum_congr rfl fun v _ => ?_
        by_cases h : v = c
        · simp [b', h]
        · simp [b', h]
      have h2 := add_sum_erase B b ha
      rw [h1, sum_add_distrib, sum_ite_eq' , ite_eq_left hc']
      linarith
    obtain ⟨p, hvalid, hrec, hlen⟩ := ih (B.erase a) b' (by rw [card_erase_of_mem ha]; omega) hsum'
    have hrec' : ∀ v, v ≠ a → v ≠ c → received p v = if v ∈ B then b v else 0 := by
      intro v hva hvc
      rw [hrec v]
      simp [b', hva, hvc, mem_erase]
    have hrec_a : received p a = 0 := by
      rw [hrec a]
      simp
    have hrec_c : received p c = b c + b a := by
      rw [hrec c, ite_eq_left hc']
      simp [b']
    rcases lt_trichotomy (b a) 0 with hneg | hzero | hpos
    · refine ⟨⟨a, c, -b a⟩ :: p, ?_, fun v => ?_, by simpa using hlen⟩
      · intro t ht
        rcases List.mem_cons.1 ht with rfl | ht
        · exact ⟨hac, by simpa using hneg⟩
        · exact hvalid t ht
      · rw [received_cons]
        by_cases hva : v = a
        · subst hva
          simp [Transfer.effect, hac, ha, hrec_a]
        · by_cases hvc : v = c
          · subst hvc
            simp [Transfer.effect, hva, hc, hrec_c]
          · simp [Transfer.effect, hva, hvc, hrec' v hva hvc]
    · refine ⟨p, hvalid, fun v => ?_, by omega⟩
      by_cases hva : v = a
      · subst hva
        simp [ha, hrec_a, hzero]
      · by_cases hvc : v = c
        · subst hvc
          simp [hc, hrec_c, hzero]
        · exact hrec' v hva hvc
    · refine ⟨⟨c, a, b a⟩ :: p, ?_, fun v => ?_, by simpa using hlen⟩
      · intro t ht
        rcases List.mem_cons.1 ht with rfl | ht
        · exact ⟨hac.symm, hpos⟩
        · exact hvalid t ht
      · rw [received_cons]
        by_cases hva : v = a
        · subst hva
          simp [Transfer.effect, hac, ha, hrec_a]
        · by_cases hvc : v = c
          · subst hvc
            simp [Transfer.effect, hva, hc, hrec_c]
          · simp [Transfer.effect, hva, hvc, hrec' v hva hvc]

variable [Fintype V]

/-- People with a non-zero balance. -/
def support (b : V → ℤ) : Finset V := univ.filter fun v => b v ≠ 0

/-- Every block of the partition sums to zero. -/
def ZeroSum (b : V → ℤ) (P : Finpartition (support b)) : Prop := ∀ B ∈ P.parts, ∑ v ∈ B, b v = 0

/-- \`k\`: the most zero-sum blocks the non-zero members can be split into. -/
noncomputable def maxBlocks (b : V → ℤ) : ℕ :=
  sSup {c | ∃ P : Finpartition (support b), ZeroSum b P ∧ P.parts.card = c}

omit [DecidableEq V] in
lemma not_mem_support {b : V → ℤ} {v : V} (h : v ∉ support b) : b v = 0 := by
  simpa [support] using h

/-- Any partition into zero-sum blocks can be paid off with \`n - (number of blocks)\` valid transfers. -/
theorem achievable (b : V → ℤ) (P : Finpartition (support b)) (hP : ZeroSum b P) :
    ∃ p : List (Transfer V), (∀ t ∈ p, t.Valid) ∧ Settles p b ∧
      p.length + P.parts.card ≤ (support b).card := by
  have key : ∀ T : Finset (Finset V), T ⊆ P.parts →
      ∃ p : List (Transfer V), (∀ t ∈ p, t.Valid) ∧
        (∀ v, received p v = ∑ B ∈ T, if v ∈ B then b v else 0) ∧
        p.length + T.card ≤ ∑ B ∈ T, B.card := by
    intro T
    induction T using Finset.induction_on with
    | empty => exact fun _ => ⟨[], by simp, by simp, by simp⟩
    | insert B T hB ih =>
      intro hT
      have hBP : B ∈ P.parts := hT (mem_insert_self _ _)
      obtain ⟨q, hq, hqr, hql⟩ := ih fun x hx => hT (mem_insert_of_mem hx)
      have hne : 0 < B.card := card_pos.2 (P.nonempty_of_mem_parts hBP)
      obtain ⟨p, hp, hpr, hpl⟩ :=
        settle_block (B.card - 1) B b (by omega) (hP B hBP)
      refine ⟨p ++ q, ?_, fun v => ?_, ?_⟩
      · intro t ht
        rcases List.mem_append.1 ht with ht | ht
        · exact hp t ht
        · exact hq t ht
      · rw [received_append, hpr, hqr, sum_insert hB]
      · rw [List.length_append, card_insert_of_notMem hB, sum_insert hB]
        omega
  obtain ⟨p, hp, hrec, hlen⟩ := key P.parts subset_rfl
  refine ⟨p, hp, fun v => ?_, ?_⟩
  · rw [hrec]
    by_cases hv : v ∈ support b
    · obtain ⟨B, hB, hvB⟩ := P.exists_mem hv
      rw [sum_eq_single B, ite_eq_left hvB]
      · intro C hC hCB
        rw [ite_eq_right]
        intro hvC
        exact hCB (P.eq_of_mem_parts hC hB hvC hvB)
      · exact fun h => absurd hB h
    · rw [not_mem_support hv]
      simp
  · rwa [P.sum_card_parts] at hlen

/-! ### Lower bound -/

/-- Any plan leaves a colouring of everybody into zero-sum classes, made by at most \`length\` merges of
singletons. Each transfer merges the payee's class into the payer's. -/
lemma exists_colouring (p : List (Transfer V)) :
    ∃ f : V → V, (∀ c, ∑ v ∈ univ.filter (fun v => f v = c), received p v = 0) ∧
      Fintype.card V ≤ (univ.image f).card + p.length := by
  induction p with
  | nil =>
    refine ⟨id, by simp, ?_⟩
    simp [Finset.card_univ]
  | cons t p ih =>
    obtain ⟨f, hf, hcard⟩ := ih
    let g : V → V := fun v => if f v = f t.payee then f t.payer else f v
    refine ⟨g, fun c => ?_, ?_⟩
    · simp only [received_cons, sum_add_distrib, sum_effect]
      by_cases hca : c = f t.payer
      · subst hca
        have h1 : t.payer ∈ univ.filter fun v => g v = f t.payer := by
          simp only [mem_filter, mem_univ, true_and, g]
          split_ifs <;> rfl
        have h2 : t.payee ∈ univ.filter fun v => g v = f t.payer := by simp [g]
        rw [ite_eq_left h1, ite_eq_left h2, sub_self, zero_add]
        by_cases had : f t.payer = f t.payee
        · have : (univ.filter fun v => g v = f t.payer) = univ.filter fun v => f v = f t.payer := by
            ext v
            simp only [mem_filter, mem_univ, true_and, g]
            split_ifs with h
            · simp [h, had]
            · rfl
          rw [this]
          exact hf _
        · have : (univ.filter fun v => g v = f t.payer) =
              (univ.filter fun v => f v = f t.payer) ∪ univ.filter fun v => f v = f t.payee := by
            ext v
            simp only [mem_filter, mem_univ, true_and, mem_union, g]
            split_ifs with h <;> simp [h]
          rw [this, sum_union, hf, hf, add_zero]
          refine Finset.disjoint_left.2 fun v hv hv' => had ?_
          rw [← (mem_filter.1 hv).2, (mem_filter.1 hv').2]
      · by_cases hcd : c = f t.payee
        · have : (univ.filter fun v => g v = c) = ∅ := by
            ext v
            simp only [mem_filter, mem_univ, true_and, notMem_empty, iff_false, g]
            split_ifs with h
            · exact fun h' => hca h'.symm
            · exact fun h' => h (h'.trans hcd)
          simp [this]
        · have : (univ.filter fun v => g v = c) = univ.filter fun v => f v = c := by
            ext v
            simp only [mem_filter, mem_univ, true_and, g]
            split_ifs with h
            · constructor
              · exact fun h' => absurd h'.symm hca
              · exact fun h' => absurd (h'.symm.trans h) hcd
            · rfl
          rw [this, hf, add_zero]
          have h1 : t.payer ∉ univ.filter fun v => f v = c := by
            simpa using fun h' : f t.payer = c => hca h'.symm
          have h2 : t.payee ∉ univ.filter fun v => f v = c := by
            simpa using fun h' : f t.payee = c => hcd h'.symm
          simp [h1, h2]
    · have : (univ.image f).card ≤ (univ.image g).card + 1 := by
        have hsub : univ.image f ⊆ insert (f t.payee) (univ.image g) := by
          intro c hc
          obtain ⟨v, -, rfl⟩ := mem_image.1 hc
          by_cases h : f v = f t.payee
          · simp [h]
          · exact mem_insert_of_mem (mem_image.2 ⟨v, mem_univ _, by simp [g, h]⟩)
        exact (card_le_card hsub).trans (card_insert_le _ _)
      simp only [List.length_cons]
      omega

lemma bddAbove_blocks (b : V → ℤ) :
    BddAbove {c | ∃ P : Finpartition (support b), ZeroSum b P ∧ P.parts.card = c} := by
  refine ⟨(support b).card, ?_⟩
  rintro c ⟨P, -, rfl⟩
  exact P.card_parts_le_card

/-- Any plan that settles \`b\` uses at least \`n - k\` transfers. -/
theorem lower_bound (b : V → ℤ) (p : List (Transfer V)) (hp : Settles p b) :
    (support b).card - maxBlocks b ≤ p.length := by
  obtain ⟨f, hf, hcard⟩ := exists_colouring p
  set S := support b with hS
  have hzero : ZeroSum b (partitionOf S f) := by
    intro B hB
    obtain ⟨c, -, rfl⟩ := mem_image.1 hB
    have h := hf c
    simp only [hp _] at h
    rw [← h]
    refine sum_subset (fun v hv => ?_) fun v hv hv' => ?_
    · simpa using (mem_filter.1 hv).2
    · have hfv : f v = c := by simpa using hv
      have : v ∉ S := fun hvS => hv' (mem_filter.2 ⟨hvS, hfv⟩)
      exact not_mem_support this
  have hle : (S.image f).card ≤ maxBlocks b := by
    rw [← card_parts_partitionOf]
    exact le_csSup (bddAbove_blocks b) ⟨_, hzero, rfl⟩
  have hsplit : (univ.image f).card ≤ (S.image f).card + (Sᶜ).card := by
    have : (univ : Finset V).image f ⊆ S.image f ∪ (Sᶜ).image f := by
      rw [← image_union, union_compl]
    exact (card_le_card this).trans
      ((card_union_le _ _).trans (Nat.add_le_add_left card_image_le _))
  have hcompl := card_compl S
  have hS' := card_le_univ S
  omega

/-- **Main theorem.** For balances summing to zero, the fewest valid transfers that settle everyone is
exactly \`n - k\`: \`n\` people with a non-zero balance, \`k\` the most zero-sum blocks they split into. -/
theorem fewest_payments (b : V → ℤ) (hb : ∑ v, b v = 0) :
    IsLeast {m | ∃ p : List (Transfer V), (∀ t ∈ p, t.Valid) ∧ Settles p b ∧ p.length = m}
      ((support b).card - maxBlocks b) := by
  have hne : {c | ∃ P : Finpartition (support b), ZeroSum b P ∧ P.parts.card = c}.Nonempty := by
    refine ⟨_, partitionOf (support b) (fun _ => ()), ?_, rfl⟩
    intro B hB
    obtain ⟨c, -, rfl⟩ := mem_image.1 hB
    rw [filter_true_of_mem (fun _ _ => rfl), ← hb]
    exact sum_subset (subset_univ _) fun v _ hv => not_mem_support hv
  obtain ⟨P, hP, hcard⟩ := Nat.sSup_mem hne (bddAbove_blocks b)
  obtain ⟨p, hvalid, hsettle, hlen⟩ := achievable b P hP
  have hk : P.parts.card = maxBlocks b := hcard
  have hlow := lower_bound b p hsettle
  refine ⟨⟨p, hvalid, hsettle, by omega⟩, ?_⟩
  rintro m ⟨q, -, hq, rfl⟩
  exact lower_bound b q hq

end SettleUp
`,h=t(),g=RegExp(`(/-[\\s\\S]*?-/|--.*$)|\\b(theorem|lemma|def|structure|where|variable|namespace|end|open|import|omit|in|noncomputable|by|fun|have|let|obtain|intro|rintro|refine|exact|rw|rwa|simp|simpa|induction|with|match|show|calc|subst|by_cases|rcases|omega|linarith)\\b`,`gm`);function _(e){let t=[],n=0;for(let r of e.matchAll(g))t.push(e.slice(n,r.index)),t.push((0,h.jsx)(`span`,{className:r[1]?`text-paper/45`:`text-[#e2be86]`,children:r[0]},r.index)),n=r.index+r[0].length;return t.push(e.slice(n)),t}function v({project:e}){let t=e.caseStudy.proof,n=(0,p.useRef)(null);return s(n),f(n),(0,h.jsxs)(`article`,{ref:n,children:[(0,h.jsx)(`div`,{className:`px-3 pt-3 sm:px-4 sm:pt-4`,children:(0,h.jsx)(`header`,{className:`ledger-paper rounded-[28px] bg-paper px-5 pb-10 pt-28 sm:px-10 sm:pb-14 sm:pt-32`,children:(0,h.jsxs)(`div`,{className:`mx-auto max-w-4xl`,children:[(0,h.jsxs)(a,{"data-hero-fade":!0,to:`/work/reductxn`,className:`inline-block text-sm text-muted transition-colors hover:text-ink`,children:[(0,h.jsx)(`span`,{"aria-hidden":!0,children:`← `}),`Reductxn`]}),(0,h.jsx)(`p`,{"data-hero-fade":!0,className:`${u} mt-7 text-gold-deep`,children:`Formally verified in Lean 4`}),(0,h.jsxs)(`h1`,{className:`mt-4 font-serif text-[clamp(2.7rem,7vw,5.5rem)] leading-[0.98] tracking-tight`,children:[(0,h.jsx)(d,{text:t.title}),(0,h.jsx)(d,{text:t.accent,accent:!0})]}),(0,h.jsx)(`p`,{"data-hero-fade":!0,className:`mt-6 max-w-2xl leading-relaxed text-muted sm:text-lg`,children:t.theorem}),(0,h.jsx)(`dl`,{"data-hero-fade":!0,className:`mt-10 grid gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-2`,children:t.facts.map(e=>(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`dt`,{className:`text-sm text-muted`,children:e.label}),(0,h.jsx)(`dd`,{className:`mt-1 break-words font-mono text-sm`,children:e.value})]},e.label))})]})})}),(0,h.jsxs)(`section`,{"aria-labelledby":`argument`,className:`mx-auto max-w-4xl px-4 py-24 sm:py-28`,children:[(0,h.jsxs)(`div`,{"data-reveal":!0,children:[(0,h.jsx)(`p`,{className:`${u} text-gold-deep`,children:`The argument`}),(0,h.jsxs)(`h2`,{id:`argument`,className:`${l} mt-4`,children:[`Two halves, `,(0,h.jsx)(`em`,{className:`text-gold`,children:`one number.`})]})]}),(0,h.jsx)(`ol`,{className:`mt-10 border-t border-ink`,children:t.steps.map((e,t)=>(0,h.jsxs)(`li`,{"data-reveal":!0,className:`grid gap-2 border-b border-line py-6 md:grid-cols-[3rem_1fr] md:gap-6`,children:[(0,h.jsx)(`span`,{className:`font-mono text-sm text-gold-deep`,children:t+1}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h3`,{className:`font-serif text-2xl sm:text-3xl`,children:e.name}),(0,h.jsx)(`p`,{className:`mt-2 leading-relaxed text-muted`,children:e.detail})]})]},e.name))})]}),(0,h.jsx)(`section`,{"aria-labelledby":`limits`,className:`mx-auto max-w-4xl px-4 pb-24`,children:(0,h.jsxs)(`div`,{"data-reveal":!0,className:`rounded-[28px] border border-line bg-paper p-6 sm:p-10`,children:[(0,h.jsx)(`h2`,{id:`limits`,className:`font-serif text-3xl sm:text-4xl`,children:`What this doesn’t prove`}),(0,h.jsx)(`ul`,{className:`mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted`,children:t.limits.map(e=>(0,h.jsx)(`li`,{children:e},e))})]})}),(0,h.jsx)(`section`,{"aria-labelledby":`source`,className:`px-3 pb-24 sm:px-4`,children:(0,h.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,h.jsx)(`h2`,{id:`source`,className:`${u} px-1 text-gold-deep`,children:`The proof, as Lean checked it`}),(0,h.jsx)(`pre`,{tabIndex:0,"aria-label":`Lean source`,className:`mt-4 max-h-[80svh] overflow-auto rounded-[20px] bg-ink p-5 font-mono text-xs leading-relaxed text-paper/90 sm:p-8 sm:text-[0.8rem]`,children:(0,h.jsx)(`code`,{children:_(m)})})]})})]})}function y(){return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(n,{}),(0,h.jsx)(r,{}),(0,h.jsxs)(`main`,{id:`main`,children:[(0,h.jsx)(v,{project:o(`reductxn`)}),(0,h.jsx)(c,{})]})]})}export{y as component};
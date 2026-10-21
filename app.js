/**
 * THE ENTITY'S WORLD CUP — Dead by Daylight Killer & Survivor Tournament Manager
 * Features:
 * - Switch between Killer Tournament and Survivor Tournament with independent state & roster.
 * - Complete 44 Killers and 48 Survivors with official wiki.gg filenames and exact imageinfo API fetching.
 * - Survivor-tailored scoring modes:
 *    1. Escapes + Gens (Flucht 0/1 + Gens repariert 0-5 als Tie-Breaker)
 *    2. Bloodpoints / Score (Match-Punkte z.B. 25.000 BP)
 *    3. Survival Time (Überlebenszeit in Sekunden z.B. 480s)
 *    4. Gens + Escapes (Gens repariert 0-5 + Flucht als Tie-Breaker)
 *    5. Custom Points (Freie Punktzahl)
 * - Killer-tailored scoring modes:
 *    1. Kills + Hooks (Kills 0-4 + Hooks 0-12 als Tie-Breaker)
 *    2. Hooks + Kills (Hooks 0-12 + Kills 0-4 als Tie-Breaker)
 *    3. Kills Only (0-4)
 *    4. Hooks Only (0-12)
 *    5. Custom Score
 * - Per-player ownership for Killers AND Survivors (up to 6 players).
 * - Smart fair player assignment algorithm per match.
 * - Legacy filter (Killer: Shape & Cenobite / Survivor: Laurie Strode).
 */

const DEFAULT_KILLERS = [
  { id: 'trapper', code: 'K01', title: 'The Trapper', name: 'Evan MacMillan', chapter: 'Base Game', licensed: false, legacy: false, icon: '🪤', color: '#a8432b', assetPath: 'Assets/Icons/Killer/The Trapper.webp', adeptPerks: ['Unnerving Presence.webp', 'Brutal Strength.webp', 'Agitation.webp'] },
  { id: 'wraith', code: 'K02', title: 'The Wraith', name: 'Philip Ojomo', chapter: 'Base Game', licensed: false, legacy: false, icon: '🔔', color: '#5c7a8a', assetPath: 'Assets/Icons/Killer/The Wraith.webp', adeptPerks: ['Predator.png', 'Bloodhound.webp', 'Shadowborn.png'] },
  { id: 'hillbilly', code: 'K03', title: 'The Hillbilly', name: 'Max Thompson Jr.', chapter: 'Base Game', licensed: false, legacy: false, icon: '🪚', color: '#b56e2b', assetPath: 'Assets/Icons/Killer/The Hillbilly.webp', adeptPerks: ['Enduring.png', 'Lightborn.png', 'Tinkerer.webp'] },
  { id: 'nurse', code: 'K04', title: 'The Nurse', name: 'Sally Smithson', chapter: 'The Last Breath', licensed: false, legacy: false, icon: '🩺', color: '#709691', assetPath: 'Assets/Icons/Killer/The Nurse.webp', adeptPerks: ['Stridor.webp', 'Thanatophobia.webp', "A Nurse's Calling.webp"] },
  { id: 'shape', code: 'K05', title: 'The Shape', name: 'Michael Myers', chapter: 'Halloween', licensed: true, legacy: true, icon: '🔪', color: '#3b5978', assetPath: 'Assets/Icons/Killer/The Shape.webp', adeptPerks: ['Save the best for last.png', 'Play With Your Food.png', 'Dying Light.png'] },
  { id: 'hag', code: 'K06', title: 'The Hag', name: 'Lisa Sherwood', chapter: 'Of Flesh and Mud', licensed: false, legacy: false, icon: '🔺', color: '#785a3c', assetPath: 'Assets/Icons/Killer/The Hag.webp', adeptPerks: ['Hex The Third Seal.png', 'Hex Ruin.png', 'Hex Devour Hope.png'] },
  { id: 'doctor', code: 'K07', title: 'The Doctor', name: 'Herman Carter', chapter: 'Spark of Madness', licensed: false, legacy: false, icon: '⚡', color: '#3e8ede', assetPath: 'Assets/Icons/Killer/The Doctor.webp', adeptPerks: ['Overwhelming Presence.png', 'Monitor & Abuse.png', 'Overcharge.png'] },
  { id: 'huntress', code: 'K08', title: 'The Huntress', name: 'Anna', chapter: 'A Lullaby for the Dark', licensed: false, legacy: false, icon: '🪓', color: '#9c3535', assetPath: 'Assets/Icons/Killer/The Huntress.webp', adeptPerks: ['Beast of Prey.webp', 'Territorial Imperative.webp', 'Hex Huntress Lullaby.png'] },
  { id: 'cannibal', code: 'K09', title: 'The Cannibal', name: 'Bubba Sawyer (Leatherface)', chapter: 'Leatherface', licensed: true, legacy: false, icon: '🥩', color: '#d49b27', assetPath: 'Assets/Icons/Killer/The Cannibal.webp', adeptPerks: ['Knock Out.png', 'Barbecue & Chili.webp', "Franklin's Demise.png"] },
  { id: 'nightmare', code: 'K10', title: 'The Nightmare', name: 'Freddy Krueger', chapter: 'A Nightmare on Elm Street', licensed: true, legacy: false, icon: '🧤', color: '#962323', assetPath: 'Assets/Icons/Killer/The Nightmare.webp', adeptPerks: ['Fire Up.png', 'Remember Me.png', 'Blood Warden.webp'] },
  { id: 'pig', code: 'K11', title: 'The Pig', name: 'Amanda Young', chapter: 'SAW', licensed: true, legacy: false, icon: '🐷', color: '#8f2424', assetPath: 'Assets/Icons/Killer/The Pig.webp', adeptPerks: ["Scourge Hook Hangman's Trick.png", 'Surveillance.webp', 'Make your Choice.png'] },
  { id: 'clown', code: 'K12', title: 'The Clown', name: 'Kenneth Chase', chapter: 'Curtain Call', licensed: false, legacy: false, icon: '🎪', color: '#b84299', assetPath: 'Assets/Icons/Killer/The Clown.webp', adeptPerks: ['Bamboozle.webp', 'Coulrophobia.png', 'Pop Goes the Weasel.png'] },
  { id: 'spirit', code: 'K13', title: 'The Spirit', name: 'Rin Yamaoka', chapter: 'Shattered Bloodline', licensed: false, legacy: false, icon: '🗡️', color: '#5882b8', assetPath: 'Assets/Icons/Killer/The Spirit.webp', adeptPerks: ['Spirit Fury.webp', 'Hex Haunted Ground.png', 'Rancor.png'] },
  { id: 'legion', code: 'K14', title: 'The Legion', name: 'Frank, Julie, Susie, Joey', chapter: 'Darkness Among Us', licensed: false, legacy: false, icon: '🎭', color: '#873b3b', assetPath: 'Assets/Icons/Killer/The Legion.webp', adeptPerks: ['Discordance.png', 'Mad Grit.png', 'Iron Maiden.png'] },
  { id: 'plague', code: 'K15', title: 'The Plague', name: 'Adiris', chapter: 'Demise of the Faithful', licensed: false, legacy: false, icon: '🏺', color: '#639c44', assetPath: 'Assets/Icons/Killer/The Plague.webp', adeptPerks: ['Corrupt Intervention.png', 'Infectious Fright.png', 'Dark Devotion.png'] },
  { id: 'ghostface', code: 'K16', title: 'The Ghost Face', name: 'Danny Johnson', chapter: 'Ghost Face', licensed: true, legacy: false, icon: '👻', color: '#596170', assetPath: 'Assets/Icons/Killer/The Ghost Face.webp', adeptPerks: ["I'm All Ears.png", 'Thrilling Tremors.webp', 'Furtive Chase.png'] },
  { id: 'demogorgon', code: 'K17', title: 'The Demogorgon', name: 'The Demogorgon', chapter: 'Stranger Things', licensed: true, legacy: false, icon: '🌺', color: '#a12f38', assetPath: 'Assets/Icons/Killer/The Demogorgon.webp', adeptPerks: ['Surge.webp', 'Mindbreaker.png', 'Cruel Limits.png'] },
  { id: 'oni', code: 'K18', title: 'The Oni', name: 'Kazan Yamaoka', chapter: 'Cursed Legacy', licensed: false, legacy: false, icon: '👹', color: '#cc2929', assetPath: 'Assets/Icons/Killer/The Oni.webp', adeptPerks: ['Zanshin Tactics.webp', 'Blood Echo.webp', 'Nemesis.png'] },
  { id: 'deathslinger', code: 'K19', title: 'The Deathslinger', name: 'Caleb Quinn', chapter: 'Chains of Hate', licensed: false, legacy: false, icon: '🤠', color: '#9e6b36', assetPath: 'Assets/Icons/Killer/The Deathslinger.webp', adeptPerks: ['Gearhead.png', 'Dead Man’s Switch.png', 'Hex Retribution.png'] },
  { id: 'executioner', code: 'K20', title: 'The Executioner', name: 'Pyramid Head', chapter: 'Silent Hill', licensed: true, legacy: false, icon: '📐', color: '#8c3b2b', assetPath: 'Assets/Icons/Killer/The Executioner.webp', adeptPerks: ['Forced Penance.png', 'Trail of Torment.webp', 'Deathbound.png'] },
  { id: 'blight', code: 'K21', title: 'The Blight', name: 'Talbot Grimes', chapter: 'Descent Beyond', licensed: false, legacy: false, icon: '🧪', color: '#e67e22', assetPath: 'Assets/Icons/Killer/The Blight.webp', adeptPerks: ['Dragon’s Grip.png', 'Hex Blood Favor.png', 'Hex Undying.png'] },
  { id: 'twins', code: 'K22', title: 'The Twins', name: 'Charlotte & Victor Deshayes', chapter: 'A Binding of Kin', licensed: false, legacy: false, icon: '👶', color: '#825840', assetPath: 'Assets/Icons/Killer/The Twins.webp', adeptPerks: ['Hoarder.png', 'Oppression.png', 'Coup de Grâce.png'] },
  { id: 'trickster', code: 'K23', title: 'The Trickster', name: 'Ji-Woon Hak', chapter: 'All-Kill', licensed: false, legacy: false, icon: '🎤', color: '#e040fb', assetPath: 'Assets/Icons/Killer/The Trickster.webp', adeptPerks: ['Starstruck.webp', 'Hex Crowd Control.png', 'No Way Out.png'] },
  { id: 'nemesis', code: 'K24', title: 'The Nemesis', name: 'Nemesis T-Type', chapter: 'Resident Evil', licensed: true, legacy: false, icon: '☣️', color: '#456990', assetPath: 'Assets/Icons/Killer/The Nemesis.webp', adeptPerks: ['Lethal Pursuer.png', 'Hysteria.png', 'Eruption.png'] },
  { id: 'cenobite', code: 'K25', title: 'The Cenobite', name: 'Elliot Spencer (Pinhead)', chapter: 'Hellraiser', licensed: true, legacy: true, icon: '⛓️', color: '#4b6584', assetPath: 'Assets/Icons/Killer/The Cenobite.webp', adeptPerks: ['Deadlock.png', 'Hex Plaything.png', 'Scourge Hook Gift of Pain.png'] },
  { id: 'artist', code: 'K26', title: 'The Artist', name: 'Carmina Mora', chapter: 'Portrait of a Murder', licensed: false, legacy: false, icon: '🐦‍⬛', color: '#383b53', assetPath: 'Assets/Icons/Killer/The Artist.webp', adeptPerks: ['Grim Embrace.png', 'Scourge Hook Pain Resonance.png', 'Hex Pentimento.png'] },
  { id: 'onryo', code: 'K27', title: 'The Onryō', name: 'Sadako Yamamura', chapter: 'Sadako Rising', licensed: true, legacy: false, icon: '📼', color: '#546de5', assetPath: 'Assets/Icons/Killer/The Onryō.webp', adeptPerks: ['Scourge Hook Floods of Rage.png', 'Call of Brine.webp', 'Merciless Storm.png'] },
  { id: 'dredge', code: 'K28', title: 'The Dredge', name: 'The Dredge', chapter: 'Roots of Dread', licensed: false, legacy: false, icon: '🌑', color: '#5f27cd', assetPath: 'Assets/Icons/Killer/The Dredge.webp', adeptPerks: ['Dissolution.png', 'Darkness Revealed.png', 'Septic Touch.png'] },
  { id: 'mastermind', code: 'K29', title: 'The Mastermind', name: 'Albert Wesker', chapter: 'Resident Evil: Project W', licensed: true, legacy: false, icon: '🕶️', color: '#10ac84', assetPath: 'Assets/Icons/Killer/The Mastermind.webp', adeptPerks: ['Superior Anatomy.webp', 'Awakened Awareness.webp', 'Terminus.webp'] },
  { id: 'knight', code: 'K30', title: 'The Knight', name: 'Tarhos Kovács', chapter: 'Forged in Fog', licensed: false, legacy: false, icon: '⚔️', color: '#576574', assetPath: 'Assets/Icons/Killer/The Knight.webp', adeptPerks: ['Nowhere to Hide.png', 'Hex Face the Darkness.png', 'Hubris.png'] },
  { id: 'skullmerchant', code: 'K31', title: 'The Skull Merchant', name: 'Adriana Imai', chapter: 'Tools of Torment', licensed: false, legacy: false, icon: '💀', color: '#c87d32', assetPath: 'Assets/Icons/Killer/The Skull Merchant.webp', adeptPerks: ['THWACK!.webp', 'Leverage.png', 'Game Afoot.png'] },
  { id: 'singularity', code: 'K32', title: 'The Singularity', name: 'HUX-A7-13', chapter: 'End Transmission', licensed: false, legacy: false, icon: '🤖', color: '#9b59b6', assetPath: 'Assets/Icons/Killer/The Singularity.webp', adeptPerks: ['Genetic Limits.png', 'Forced Hesitation.png', 'Machine Learning.png'] },
  { id: 'xenomorph', code: 'K33', title: 'The Xenomorph', name: 'The Xenomorph', chapter: 'Alien', licensed: true, legacy: false, icon: '👽', color: '#1abc9c', assetPath: 'Assets/Icons/Killer/The Xenomorph.webp', adeptPerks: ['Ultimate Weapon.webp', 'Rapid Brutality.png', 'Alien Instinct.webp'] },
  { id: 'goodguy', code: 'K34', title: 'The Good Guy', name: 'Chucky (Charles Lee Ray)', chapter: 'Chucky', licensed: true, legacy: false, icon: '🪆', color: '#e74c3c', assetPath: 'Assets/Icons/Killer/The Good Guy.webp', adeptPerks: ['Hex Two Can Play.png', 'Friends ‘Til the End.png', 'Batteries Included.webp'] },
  { id: 'unknown', code: 'K35', title: 'The Unknown', name: 'The Unknown', chapter: 'All Things Wicked', licensed: false, legacy: false, icon: '❓', color: '#8e44ad', assetPath: 'Assets/Icons/Killer/The Unkown.webp', adeptPerks: ['Unbound.webp', 'Unforeseen.webp', 'Undone.webp'] },
  { id: 'lich', code: 'K36', title: 'The Lich', name: 'Vecna (D&D)', chapter: 'Dungeons & Dragons', licensed: true, legacy: false, icon: '🧙‍♂️', color: '#9c27b0', assetPath: 'Assets/Icons/Killer/The Lich.webp', adeptPerks: ['Weave Attunement.webp', 'Languid Touch.png', 'Dark Arrogance.png'] },
  { id: 'darklord', code: 'K37', title: 'The Dark Lord', name: 'Dracula (Vlad Tepes)', chapter: 'Castlevania', licensed: true, legacy: false, icon: '🦇', color: '#b71c1c', assetPath: 'Assets/Icons/Killer/The Dark Lord.webp', adeptPerks: ['Hex Wretched Fate.png', 'Human Greed.png', 'Dominance.png'] },
  { id: 'houndmaster', code: 'K38', title: 'The Houndmaster', name: 'Portia Maye', chapter: 'Doomed Course', licensed: false, legacy: false, icon: '🐕', color: '#795548', assetPath: 'Assets/Icons/Killer/The Houndmaster.webp', adeptPerks: ['All-Shaking Thunder.webp', 'Scourge Hook Jagged Compass.png', 'No Quarter.png'] },
  { id: 'ghoul', code: 'K39', title: 'The Ghoul', name: 'Ken Kaneki', chapter: 'Tokyo Ghoul', licensed: true, legacy: false, icon: '👁️', color: '#c0392b', assetPath: 'Assets/Icons/Killer/The Ghoul.webp', adeptPerks: ['Hex Nothing But Misery.png', 'Forever Entwined.png', 'None Are Free.png'] },
  { id: 'animatronic', code: 'K40', title: 'The Animatronic', name: 'Springtrap (William Afton)', chapter: 'Five Nights at Freddy\'s', licensed: true, legacy: false, icon: '🐰', color: '#689f38', assetPath: 'Assets/Icons/Killer/The Animatronic.webp', adeptPerks: ['Help Wanted.png', 'Phantom Fear.png', 'Haywire.png'] },
  { id: 'krasue', code: 'K41', title: 'The Krasue', name: 'Burong Sukapat', chapter: 'Sinister Grace', licensed: false, legacy: false, icon: '🩸', color: '#ad1457', assetPath: 'Assets/Icons/Killer/The Krasue.webp', adeptPerks: ['Ravenous.png', 'Wandering Eye.webp', 'Hex Overture of Doom.png'] },
  { id: 'first', code: 'K42', title: 'The First', name: 'Henry Creel (001)', chapter: 'Stranger Things Ch. 2', licensed: true, legacy: false, icon: '🕰️', color: '#880e4f', assetPath: 'Assets/Icons/Killer/The First.webp', adeptPerks: ['Turn Back The Clock.webp', 'Secret Project.png', 'Hex Hive Mind.png'] },
  { id: 'slasher', code: 'K43', title: 'The Slasher', name: 'Jason Voorhees', chapter: 'Friday the 13th', licensed: true, legacy: false, icon: '🏒', color: '#37474f', assetPath: 'Assets/Icons/Killer/The Slasher.webp', adeptPerks: ['Silent Shadow.png', 'Rampage.png', 'Hex Scared to Death.png'] },
  { id: 'judgment', code: 'K44', title: 'The Judgment', name: 'Celestial Executioner', chapter: 'Chorus of Sin', licensed: false, legacy: false, icon: '⚖️', color: '#f39c12', assetPath: 'Assets/Icons/Killer/The Judgement.webp', adeptPerks: ["Salvation's Cry.png", 'Celestial Witness.webp', 'Lay Waste.png'] }
];

const DEFAULT_SURVIVORS = [
  { id: 'dwight', code: 'S01', title: 'Dwight Fairfield', name: 'Dwight Fairfield', chapter: 'Base Game', licensed: false, legacy: false, icon: '👓', color: '#b45309', assetPath: 'Assets/Icons/Survivor/Dwight Fairfield.webp', adeptPerks: ['Bond.webp', 'Prove Thyself.png', 'Leader.png'] },
  { id: 'meg', code: 'S02', title: 'Meg Thomas', name: 'Meg Thomas', chapter: 'Base Game', licensed: false, legacy: false, icon: '🏃‍♀️', color: '#b91c1c', assetPath: 'Assets/Icons/Survivor/Meg Thomas.webp', adeptPerks: ['Quick & Quiet.png', 'Sprint Burst.webp', 'Adrenaline.webp'] },
  { id: 'claudette', code: 'S03', title: 'Claudette Morel', name: 'Claudette Morel', chapter: 'Base Game', licensed: false, legacy: false, icon: '🌿', color: '#15803d', assetPath: 'Assets/Icons/Survivor/Claudette Morel.webp', adeptPerks: ['Empathy.png', 'Botany Knowledge.webp', 'Self-Care.png'] },
  { id: 'jake', code: 'S04', title: 'Jake Park', name: 'Jake Park', chapter: 'Base Game', licensed: false, legacy: false, icon: '🌲', color: '#047857', assetPath: 'Assets/Icons/Survivor/Jake Park.webp', adeptPerks: ['Iron Will.png', 'Calm Spirit.webp', 'Saboteur.png'] },
  { id: 'nea', code: 'S05', title: 'Nea Karlsson', name: 'Nea Karlsson', chapter: 'The Last Breath', licensed: false, legacy: false, icon: '🛹', color: '#6d28d9', assetPath: 'Assets/Icons/Survivor/Nea Karlsson.webp', adeptPerks: ['Balanced Landing.webp', 'Urban Evasion.webp', 'Streetwise.webp'] },
  { id: 'laurie', code: 'S06', title: 'Laurie Strode', name: 'Laurie Strode', chapter: 'Halloween', licensed: true, legacy: true, icon: '🎃', color: '#c2410c', assetPath: 'Assets/Icons/Survivor/Laurie Strode.webp', adeptPerks: ['Sole Survivor.webp', 'Object of Obsession.png', 'Decisive Strike.png'] },
  { id: 'ace', code: 'S07', title: 'Ace Visconti', name: 'Ace Visconti', chapter: 'Of Flesh and Mud', licensed: false, legacy: false, icon: '🎲', color: '#4338ca', assetPath: 'Assets/Icons/Survivor/Ace Visconti.webp', adeptPerks: ['Open-Handed.png', 'Up the Ante.webp', 'Ace in the Hole.webp'] },
  { id: 'bill', code: 'S08', title: 'William "Bill" Overbeck', name: 'William Overbeck', chapter: 'Left Behind', licensed: true, legacy: false, icon: '🪖', color: '#374151', assetPath: 'Assets/Icons/Survivor/William Bill Overbeck.webp', adeptPerks: ['Left Behind.png', 'Borrowed Time.webp', 'Unbreakable.webp'] },
  { id: 'feng', code: 'S09', title: 'Feng Min', name: 'Feng Min', chapter: 'Spark of Madness', licensed: false, legacy: false, icon: '🎮', color: '#0284c7', assetPath: 'Assets/Icons/Survivor/Feng Min.webp', adeptPerks: ['Technician.webp', 'Lithe.png', 'Alert.webp'] },
  { id: 'david', code: 'S10', title: 'David King', name: 'David King', chapter: 'A Lullaby for the Dark', licensed: false, legacy: false, icon: '🥊', color: '#7f1d1d', assetPath: 'Assets/Icons/Survivor/David King.webp', adeptPerks: ["We're Gonna Live Forever.webp", 'Dead Hard.png', 'No Mither.png'] },
  { id: 'quentin', code: 'S11', title: 'Quentin Smith', name: 'Quentin Smith', chapter: 'A Nightmare on Elm Street', licensed: true, legacy: false, icon: '💊', color: '#1e3a8a', assetPath: 'Assets/Icons/Survivor/Quentin Smith.webp', adeptPerks: ['Wake Up!.webp', 'Pharmacy.png', 'Vigil.webp'] },
  { id: 'tapp', code: 'S12', title: 'Detective David Tapp', name: 'David Tapp', chapter: 'SAW', licensed: true, legacy: false, icon: '🔍', color: '#334155', assetPath: 'Assets/Icons/Survivor/Detective Tapp.webp', adeptPerks: ['Tenacity.webp', "Detective's Hunch.png", 'Stake Out.webp'] },
  { id: 'kate', code: 'S13', title: 'Kate Denson', name: 'Kate Denson', chapter: 'Curtain Call', licensed: false, legacy: false, icon: '🎸', color: '#d97706', assetPath: 'Assets/Icons/Survivor/Kate Denson.webp', adeptPerks: ['Dance With Me.png', 'Windows of Opportunity.webp', 'Boil Over.webp'] },
  { id: 'adam', code: 'S14', title: 'Adam Francis', name: 'Adam Francis', chapter: 'Shattered Bloodline', licensed: false, legacy: false, icon: '📚', color: '#0f766e', assetPath: 'Assets/Icons/Survivor/Adam Francis.webp', adeptPerks: ['Diversion.png', 'Deliverance.png', 'Autodidact.webp'] },
  { id: 'jeff', code: 'S15', title: 'Jeff Johansen', name: 'Jeff Johansen', chapter: 'Darkness Among Us', licensed: false, legacy: false, icon: '🎨', color: '#44403c', assetPath: 'Assets/Icons/Survivor/Jeff Johansen.webp', adeptPerks: ['Breakdown.webp', 'Aftercare.webp', 'Distortion.png'] },
  { id: 'jane', code: 'S16', title: 'Jane Romero', name: 'Jane Romero', chapter: 'Demise of the Faithful', licensed: false, legacy: false, icon: '🎙️', color: '#be185d', assetPath: 'Assets/Icons/Survivor/Jane Romero.webp', adeptPerks: ['Solidarity.webp', 'Poised.png', 'Head On.png'] },
  { id: 'ash', code: 'S17', title: 'Ash Williams', name: 'Ashley J. Williams', chapter: 'Ash vs Evil Dead', licensed: true, legacy: false, icon: '🖐️', color: '#1d4ed8', assetPath: 'Assets/Icons/Survivor/Ashley J. Williams.webp', adeptPerks: ['Flip-Flop.png', 'Buckle Up.webp', 'Mettle of Man.png'] },
  { id: 'nancy', code: 'S18', title: 'Nancy Wheeler', name: 'Nancy Wheeler', chapter: 'Stranger Things', licensed: true, legacy: false, icon: '📰', color: '#9a3412', assetPath: 'Assets/Icons/Survivor/Nancy Wheeler.webp', adeptPerks: ['Better Together.webp', 'Fixated.png', 'Inner Strength.png'] },
  { id: 'steve', code: 'S19', title: 'Steve Harrington', name: 'Steve Harrington', chapter: 'Stranger Things', licensed: true, legacy: false, icon: '🦇', color: '#1e40af', assetPath: 'Assets/Icons/Survivor/Steve Harrington.webp', adeptPerks: ['Babysitter.webp', 'Camaraderie.webp', 'Second Wind.png'] },
  { id: 'yui', code: 'S20', title: 'Yui Kimura', name: 'Yui Kimura', chapter: 'Cursed Legacy', licensed: false, legacy: false, icon: '🏍️', color: '#991b1b', assetPath: 'Assets/Icons/Survivor/Yui Kimura.webp', adeptPerks: ['Any Means Necessary.webp', 'Breakout.webp', 'Lucky Break.png'] },
  { id: 'zarina', code: 'S21', title: 'Zarina Kassir', name: 'Zarina Kassir', chapter: 'Chains of Hate', licensed: false, legacy: false, icon: '🎥', color: '#a16207', assetPath: 'Assets/Icons/Survivor/Zarina Kassir.webp', adeptPerks: ['Off the Record.png', 'Red Herring.png', 'For the People.png'] },
  { id: 'cheryl', code: 'S22', title: 'Cheryl Mason', name: 'Cheryl Mason (Heather)', chapter: 'Silent Hill', licensed: true, legacy: false, icon: '📻', color: '#166534', assetPath: 'Assets/Icons/Survivor/Cheryl Mason.webp', adeptPerks: ['Soul Guard.webp', 'Blood Pact.webp', 'Repressed Alliance.png'] },
  { id: 'felix', code: 'S23', title: 'Felix Richter', name: 'Felix Richter', chapter: 'Descent Beyond', licensed: false, legacy: false, icon: '📐', color: '#0369a1', assetPath: 'Assets/Icons/Survivor/Felix Richter.webp', adeptPerks: ['Visionary.webp', 'Desperate Measures.png', 'Built to Last.webp'] },
  { id: 'elodie', code: 'S24', title: 'Élodie Rakoto', name: 'Élodie Rakoto', chapter: 'A Binding of Kin', licensed: false, legacy: false, icon: '🧭', color: '#7e22ce', assetPath: 'Assets/Icons/Survivor/Elodie Rakota.webp', adeptPerks: ['Appraisal.webp', 'Deception.png', 'Power Struggle.png'] },
  { id: 'yunjin', code: 'S25', title: 'Yun-Jin Lee', name: 'Yun-Jin Lee', chapter: 'All-Kill', licensed: false, legacy: false, icon: '💎', color: '#a21caf', assetPath: 'Assets/Icons/Survivor/Lee Yun-Jin.webp', adeptPerks: ['Fast Track.png', 'Smash Hit.png', 'Self-Preservation.png'] },
  { id: 'jill', code: 'S26', title: 'Jill Valentine', name: 'Jill Valentine', chapter: 'Resident Evil', licensed: true, legacy: false, icon: '⭐', color: '#1e3a8a', assetPath: 'Assets/Icons/Survivor/Jill Valentine.webp', adeptPerks: ['Counterforce.png', 'Resurgence.png', 'Blast Mine.webp'] },
  { id: 'leon', code: 'S27', title: 'Leon S. Kennedy', name: 'Leon Scott Kennedy', chapter: 'Resident Evil', licensed: true, legacy: false, icon: '🛡️', color: '#1e293b', assetPath: 'Assets/Icons/Survivor/Leon S. Kennedy.webp', adeptPerks: ['Bite the Bullet.webp', 'Flashbang.png', 'Rookie Spirit.png'] },
  { id: 'mikaela', code: 'S28', title: 'Mikaela Reid', name: 'Mikaela Reid', chapter: 'Hour of the Witch', licensed: false, legacy: false, icon: '🕯️', color: '#c2410c', assetPath: 'Assets/Icons/Survivor/Mikaela Reid.webp', adeptPerks: ['Clairvoyance.webp', 'Boon Circle of Healing.webp', 'Boon Shadow Step.webp'] },
  { id: 'jonah', code: 'S29', title: 'Jonah Vasquez', name: 'Jonah Vasquez', chapter: 'Portrait of a Murder', licensed: false, legacy: false, icon: '🔢', color: '#047857', assetPath: 'Assets/Icons/Survivor/Jonah Vasquez.webp', adeptPerks: ['Overcome.png', 'Corrective Action.png', 'Boon Exponential.webp'] },
  { id: 'yoichi', code: 'S30', title: 'Yoichi Asakawa', name: 'Yoichi Asakawa', chapter: 'Sadako Rising', licensed: true, legacy: false, icon: '🌊', color: '#0e7490', assetPath: 'Assets/Icons/Survivor/Yoichi Asakawa.webp', adeptPerks: ['Parental Guidance.png', 'Empathic Connection.png', 'Boon Dark Theory.webp'] },
  { id: 'haddie', code: 'S31', title: 'Haddie Kaur', name: 'Haddie Kaur', chapter: 'Roots of Dread', licensed: false, legacy: false, icon: '🎙️', color: '#4c1d95', assetPath: 'Assets/Icons/Survivor/Haddie Kaur.webp', adeptPerks: ['Inner Focus.png', 'Residual Manifest.png', 'Overzealous.png'] },
  { id: 'ada', code: 'S32', title: 'Ada Wong', name: 'Ada Wong', chapter: 'Resident Evil: Project W', licensed: true, legacy: false, icon: '👠', color: '#881337', assetPath: 'Assets/Icons/Survivor/Ada Wong.webp', adeptPerks: ['Wiretap.webp', 'Reactive Healing.png', 'Low Profile.png'] },
  { id: 'rebecca', code: 'S33', title: 'Rebecca Chambers', name: 'Rebecca Chambers', chapter: 'Resident Evil: Project W', licensed: true, legacy: false, icon: '🩹', color: '#166534', assetPath: 'Assets/Icons/Survivor/Rebecca Chambers.webp', adeptPerks: ['Better Than New.webp', 'Reassurance.png', 'Hyperfocus.png'] },
  { id: 'vittorio', code: 'S34', title: 'Vittorio Toscano', name: 'Vittorio Toscano', chapter: 'Forged in Fog', licensed: false, legacy: false, icon: '📜', color: '#b45309', assetPath: 'Assets/Icons/Survivor/Vittorio Toscano.webp', adeptPerks: ['Potential Energy.png', 'Fogwise.png', 'Quick Gambit.png'] },
  { id: 'thalita', code: 'S35', title: 'Thalita Lyra', name: 'Thalita Lyra', chapter: 'Tools of Torment', licensed: false, legacy: false, icon: '🪁', color: '#0284c7', assetPath: 'Assets/Icons/Survivor/Thalita Lyra.webp', adeptPerks: ['Cut Loose.png', 'Friendly Competition.png', 'Teamwork Power of Two.webp'] },
  { id: 'renato', code: 'S36', title: 'Renato Lyra', name: 'Renato Lyra', chapter: 'Tools of Torment', licensed: false, legacy: false, icon: '🪁', color: '#0d9488', assetPath: 'Assets/Icons/Survivor/Renato Lyra.webp', adeptPerks: ['Background Player.webp', 'Blood Rush.webp', 'Teamwork Collective Stealth.webp'] },
  { id: 'gabriel', code: 'S37', title: 'Gabriel Soma', name: 'Gabriel Soma', chapter: 'End Transmission', licensed: false, legacy: false, icon: '🧬', color: '#6366f1', assetPath: 'Assets/Icons/Survivor/Gabriel Soma.webp', adeptPerks: ['Troubleshooter.webp', 'Made for This.png', 'Scavenger.png'] },
  { id: 'nicolas', code: 'S38', title: 'Nicolas Cage', name: 'Nicolas Cage', chapter: 'Nicolas Cage', licensed: true, legacy: false, icon: '🎬', color: '#ea580c', assetPath: 'Assets/Icons/Survivor/Nicolas Cage.webp', adeptPerks: ['Dramaturgy.png', 'Scene Partner.png', 'Plot Twist.png'] },
  { id: 'ripley', code: 'S39', title: 'Ellen Ripley', name: 'Ellen Ripley', chapter: 'Alien', licensed: true, legacy: false, icon: '🐱', color: '#0f766e', assetPath: 'Assets/Icons/Survivor/Ellen Ripley.webp', adeptPerks: ['Chemical Trap.webp', 'Light-footed.png', 'Lucky Star.png'] },
  { id: 'alan', code: 'S40', title: 'Alan Wake', name: 'Alan Wake', chapter: 'Alan Wake', licensed: true, legacy: false, icon: '🔦', color: '#334155', assetPath: 'Assets/Icons/Survivor/Alan Wake.webp', adeptPerks: ['Champion of Light.webp', 'Boon Illumination.webp', 'Deadline.png'] },
  { id: 'sable', code: 'S41', title: 'Sable Ward', name: 'Sable Ward', chapter: 'All Things Wicked', licensed: false, legacy: false, icon: '🕸️', color: '#701a75', assetPath: 'Assets/Icons/Survivor/Sable Ward.webp', adeptPerks: ['Invocation Weaving Spiders.png', 'Strength in Shadows.webp', 'Wicked.webp'] },
  { id: 'troupe', code: 'S42', title: 'The Troupe (Aestri & Baermar)', name: 'Aestri Yazar / Baermar Uraz', chapter: 'Dungeons & Dragons', licensed: true, legacy: false, icon: '🪕', color: '#b45309', assetPath: 'Assets/Icons/Survivor/Aestri Yazar.webp', adeptPerks: ['Mirrored Illusion.png', 'Bardic Inspiration.webp', 'Still Sight.webp'] },
  { id: 'lara', code: 'S43', title: 'Lara Croft', name: 'Lara Croft', chapter: 'Tomb Raider', licensed: true, legacy: false, icon: '🏹', color: '#0369a1', assetPath: 'Assets/Icons/Survivor/Lara Croft.webp', adeptPerks: ['Finesse.png', 'Hardened.png', 'Specialist.webp'] },
  { id: 'trevor', code: 'S44', title: 'Trevor Belmont', name: 'Trevor Belmont', chapter: 'Castlevania', licensed: true, legacy: false, icon: '🪢', color: '#991b1b', assetPath: 'Assets/Icons/Survivor/Trevor Belmont.webp', adeptPerks: ['Eyes of Belmont.png', 'Exultation.png', 'Moment of Glory.png'] },
  { id: 'taurie', code: 'S45', title: 'Taurie Cain', name: 'Taurie Cain', chapter: 'Doomed Course', licensed: false, legacy: false, icon: '🗡️', color: '#1c1917', assetPath: 'Assets/Icons/Survivor/Taurie Cane.webp', adeptPerks: ['Shoulder the Burden.png', 'Clean Break.png', 'Invocation Treacherous Crows.png'] },
  { id: 'orela', code: 'S46', title: 'Orela Rose', name: 'Orela Rose', chapter: 'Steady Pulse', licensed: false, legacy: false, icon: '🎧', color: '#ec4899', assetPath: 'Assets/Icons/Survivor/Orela Rose.webp', adeptPerks: ['Do No Harm.png', 'Duty of Care.png', 'Rapid Response.png'] },
  { id: 'rick', code: 'S47', title: 'Rick Grimes', name: 'Rick Grimes', chapter: 'The Walking Dead', licensed: true, legacy: false, icon: '🤠', color: '#92400e', assetPath: 'Assets/Icons/Survivor/Rick Grimes.webp', adeptPerks: ['Apocalyptic Ingenuity.webp', 'Come and Get Me!.png', 'Teamwork Toughen Up.webp'] },
  { id: 'michonne', code: 'S48', title: 'Michonne Grimes', name: 'Michonne Grimes', chapter: 'The Walking Dead', licensed: true, legacy: false, icon: '⚔️', color: '#7c2d12', assetPath: 'Assets/Icons/Survivor/Michonne Grimes.webp', adeptPerks: ['Conviction.png', 'Last Stand.png', 'Teamwork Throw Down.webp'] },
  { id: 'vee', code: 'S49', title: 'Vee Boonyasak', name: 'Vee Boonyasak', chapter: 'Sinister Grace', licensed: false, legacy: false, icon: '🥁', color: '#e11d48', assetPath: 'Assets/Icons/Survivor/Vee Boonyasak.webp', adeptPerks: ['Ghost Notes.png', 'ONE-TWO-THREE-FOUR!.png', 'Road Life.png'] },
  { id: 'dustin', code: 'S50', title: 'Dustin Henderson', name: 'Dustin Henderson', chapter: 'Stranger Things Ch. 2', licensed: true, legacy: false, icon: '🧢', color: '#2563eb', assetPath: 'Assets/Icons/Survivor/Dustin Henderson.webp', adeptPerks: ['Bada Bada Boom.webp', 'Change of Plan.webp', 'Teamwork Full Circuit.webp'] },
  { id: 'eleven', code: 'S51', title: 'Eleven', name: 'Jane "Eleven" Hopper', chapter: 'Stranger Things Ch. 2', licensed: true, legacy: false, icon: '🧇', color: '#db2777', assetPath: 'Assets/Icons/Survivor/Eleven.webp', adeptPerks: ['Extrasensory Perception.png', 'We See You.webp', 'Teamwork Soft-Spoken.webp'] },
  { id: 'kwon', code: 'S52', title: 'Kwon Tae-young', name: 'Kwon Tae-young', chapter: 'Original Chapter', licensed: false, legacy: false, icon: '🎧', color: '#4f46e5', assetPath: 'Assets/Icons/Survivor/Kwon Tae-young.webp', adeptPerks: ['Five Moves Ahead.png', 'Flow State.png', 'Lend a Hand.png'] },
  { id: 'shane', code: 'S53', title: 'Shane Wiigwaas', name: 'Shane Wiigwaas', chapter: 'Original Chapter', licensed: false, legacy: false, icon: '🔥', color: '#059669', assetPath: 'Assets/Icons/Survivor/Shane Wiigwaas.webp', adeptPerks: ['Boon Steadfast.webp', 'Cross-Examination.png', 'Wide Open Throttle.webp'] },
  { id: 'aurora', code: 'S54', title: 'Aurora Stardotter', name: 'Aurora Stardotter', chapter: 'Chorus of Sin', licensed: false, legacy: false, icon: '✨', color: '#8b5cf6', assetPath: 'Assets/Icons/Survivor/Aurora Stardotter.webp', adeptPerks: ['A Place For Us.webp', 'Down to the Last.png', 'Fruits of Your Labor.png'] }
];

const GENERAL_KILLER_PERKS = [
  'Bitter Murmur.webp',
  'Deerstalker.png',
  'Distressing.png',
  'Hex No One Escapes Death.png',
  'Hex Thrill of the Hunt.png',
  'Hex Under Your Thumb.png',
  'Insidious.png',
  'Iron Grasp.png',
  'No Holds Barred.png',
  'Scourge Hook Monstrous Shrine.png',
  'Shattered Hope.png',
  'Sloppy Butcher.png',
  'Spies from the Shadows.webp',
  'Unrelenting.webp',
  'Weeping Wounds.webp',
  'Whispers.webp'
];

const GENERAL_SURVIVOR_PERKS = [
  'Dark Sense.png',
  'Deja Vu.png',
  'Hope.png',
  'Keep Them Waiting.png',
  'Kindred.png',
  'Lightweight.png',
  'No One Left Behind.png',
  "Plunderer's Instinct.png",
  'Premonition.png',
  'Resilience.png',
  'Slippery Meat.png',
  'Small Game.png',
  'Spine Chill.webp',
  'This Is Not Happening.webp',
  "We'll make it.webp"
];

const PERK_MODES = {
  get random() { return t('perkMode_random_desc'); },
  get adept() { return t('perkMode_adept_desc'); },
  get custom() { return t('perkMode_custom_desc'); },
  get perkless() { return t('perkMode_perkless_desc'); }
};

const ITEM_ADDON_MODES = {
  get random() { return t('itemAddonMode_random_desc'); },
  get custom() { return t('itemAddonMode_custom_desc'); },
  get none() { return t('itemAddonMode_none_desc'); }
};

const ITEM_POOL_MODES = {
  get basis() { return t('itemPoolMode_basis_desc'); },
  get events() { return t('itemPoolMode_events_desc'); }
};

function getScoringModes(role = currentRole) {
  if (role === 'killer') {
    return [
      { id: 'kills_hooks', label: t('mode_kills_hooks_label'), desc: t('mode_kills_hooks_desc') },
      { id: 'hooks_kills', label: t('mode_hooks_kills_label'), desc: t('mode_hooks_kills_desc') },
      { id: 'kills_only', label: t('mode_kills_only_label'), desc: t('mode_kills_only_desc') },
      { id: 'hooks_only', label: t('mode_hooks_only_label'), desc: t('mode_hooks_only_desc') },
      { id: 'custom_score', label: t('mode_custom_score_killer_label'), desc: t('mode_custom_score_killer_desc') }
    ];
  }
  return [
    { id: 'escapes_gens', label: t('mode_escapes_gens_label'), desc: t('mode_escapes_gens_desc') },
    { id: 'bloodpoints', label: t('mode_bloodpoints_label'), desc: t('mode_bloodpoints_desc') },
    { id: 'survival_time', label: t('mode_survival_time_label'), desc: t('mode_survival_time_desc') },
    { id: 'gens_escapes', label: t('mode_gens_escapes_label'), desc: t('mode_gens_escapes_desc') },
    { id: 'custom_score', label: t('mode_custom_score_survivor_label'), desc: t('mode_custom_score_survivor_desc') }
  ];
}

const SCORING_MODES = {
  get killer() { return getScoringModes('killer'); },
  get survivor() { return getScoringModes('survivor'); }
};

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];

const STORAGE_KEY_PREFIX = 'dbd_tournament_app_v3_';
const PORTRAIT_CACHE_KEY = 'dbd_wiki_portrait_urls_v3';

// Base URL for official Dead by Daylight wiki MediaWiki file serving
const WIKI_FILE_BASE = 'https://deadbydaylight.wiki.gg/wiki/Special:FilePath/';

// Cached exact image URLs resolved from deadbydaylight.wiki.gg
let wikiPortraitCache = {};

// Default 2 Players owning all killers and survivors initially
function createDefaultPlayers() {
  const defaultKillerPrestige = {};
  DEFAULT_KILLERS.forEach(k => { defaultKillerPrestige[k.id] = 3; });
  const defaultSurvivorPrestige = {};
  DEFAULT_SURVIVORS.forEach(s => { defaultSurvivorPrestige[s.id] = 3; });

  return [
    {
      id: 'p1',
      name: 'Spieler 1',
      color: PLAYER_COLORS[0],
      active: true,
      ownedKillerIds: DEFAULT_KILLERS.map(k => k.id),
      ownedSurvivorIds: DEFAULT_SURVIVORS.map(s => s.id),
      killerPrestige: { ...defaultKillerPrestige },
      survivorPrestige: { ...defaultSurvivorPrestige },
      unlockedKillerPerks: [],
      unlockedSurvivorPerks: []
    },
    {
      id: 'p2',
      name: 'Spieler 2',
      color: PLAYER_COLORS[1],
      active: true,
      ownedKillerIds: DEFAULT_KILLERS.map(k => k.id),
      ownedSurvivorIds: DEFAULT_SURVIVORS.map(s => s.id),
      killerPrestige: { ...defaultKillerPrestige },
      survivorPrestige: { ...defaultSurvivorPrestige },
      unlockedKillerPerks: [],
      unlockedSurvivorPerks: []
    }
  ];
}

// Global Application Root State
let currentRole = 'killer'; // 'killer' or 'survivor'

// Tournament data for each role
let tournamentData = {
  killer: {
    characters: [...DEFAULT_KILLERS],
    selectedIds: DEFAULT_KILLERS.map(k => k.id),
    config: {
      groupSize: 4,
      advanceMode: 'top2',
      scoringMode: 'kills_hooks',
      perkMode: 'random',
      itemAddonMode: 'random',
      itemPoolMode: 'basis',
      thirdPlaceMatch: true
    },
    tournamentStarted: false,
    activeGroupFilter: 'ALL',
    groups: [],
    bracket: { rounds: [], thirdPlace: null }
  },
  survivor: {
    characters: [...DEFAULT_SURVIVORS],
    selectedIds: DEFAULT_SURVIVORS.map(s => s.id),
    config: {
      groupSize: 4,
      advanceMode: 'top2',
      scoringMode: 'escapes_gens',
      perkMode: 'random',
      itemAddonMode: 'random',
      itemPoolMode: 'basis',
      thirdPlaceMatch: true
    },
    tournamentStarted: false,
    activeGroupFilter: 'ALL',
    groups: [],
    bracket: { rounds: [], thirdPlace: null }
  }
};

let sharedPlayers = createDefaultPlayers();
let selectedPlayerEditorId = 'p1';
let currentActiveView = 'setup';

// Active modal editing pointers
let editingMatchRef = null;
let editingTieWinner = null;
let manualSwapSelection = null;
let editingPerksA = [null, null, null, null];
let editingPerksB = [null, null, null, null];
let activePerkPickerTarget = null; // { side: 'A' | 'B', slotIndex: 0..3 }
let editingItemA = null;
let editingItemB = null;
let editingAddonsA = [null, null];
let editingAddonsB = [null, null];
let activeItemAddonPickerTarget = null; // { side: 'A' | 'B', targetType: 'item' | 'addon', slotIndex: 0 | 1 }
let activePlayerEditorTab = 'roster'; // 'roster' | 'shrine'
let shrineSearchQuery = '';
let shrineFilterCategory = 'all';

/* ==================== HELPER GETTERS ==================== */
function getCurrentTournament() {
  return tournamentData[currentRole];
}

function getCurrentConfig() {
  return getCurrentTournament().config;
}

function getCurrentRoster() {
  return getCurrentTournament().characters;
}

function getCurrentSelectedIds() {
  return getCurrentTournament().selectedIds;
}

function getCharacter(id) {
  const current = getCurrentRoster().find(c => c.id === id);
  if (current) return current;
  // Check alternative roster as fallback
  const alt = (currentRole === 'killer' ? DEFAULT_SURVIVORS : DEFAULT_KILLERS).find(c => c.id === id);
  if (alt) return alt;
  return {
    id: id || 'tbd',
    title: 'TBD',
    name: 'Noch offen',
    chapter: '-',
    licensed: false,
    legacy: false,
    icon: '❓',
    color: '#444'
  };
}

function getPlayer(playerId) {
  return sharedPlayers.find(p => p.id === playerId) || null;
}

function getActivePlayers() {
  const active = sharedPlayers.filter(p => p.active !== false);
  return active.length > 0 ? active : sharedPlayers;
}

function getPlayerOwnedIds(player, role = currentRole) {
  if (!player) return [];
  if (role === 'killer') {
    if (!Array.isArray(player.ownedKillerIds)) player.ownedKillerIds = DEFAULT_KILLERS.map(k => k.id);
    return player.ownedKillerIds;
  } else {
    if (!Array.isArray(player.ownedSurvivorIds)) player.ownedSurvivorIds = DEFAULT_SURVIVORS.map(s => s.id);
    return player.ownedSurvivorIds;
  }
}

function getPlayerPrestige(player, charId, role = currentRole) {
  if (!player || !charId) return 0;
  const prestigeMap = role === 'killer' ? player.killerPrestige : player.survivorPrestige;
  if (prestigeMap && typeof prestigeMap[charId] === 'number') {
    return Math.max(0, Math.min(3, prestigeMap[charId]));
  }
  const owned = getPlayerOwnedIds(player, role);
  return owned.includes(charId) ? 3 : 0;
}

function setPlayerPrestige(player, charId, level, role = currentRole) {
  if (!player || !charId) return;
  const prestigeKey = role === 'killer' ? 'killerPrestige' : 'survivorPrestige';
  if (!player[prestigeKey]) player[prestigeKey] = {};
  const clamped = Math.max(0, Math.min(3, parseInt(level, 10) || 0));
  player[prestigeKey][charId] = clamped;

  const owned = getPlayerOwnedIds(player, role);
  if (clamped > 0 && !owned.includes(charId)) {
    owned.push(charId);
  }
}

function getPlayerShrinePerks(player, role = currentRole) {
  if (!player) return [];
  const key = role === 'killer' ? 'unlockedKillerPerks' : 'unlockedSurvivorPerks';
  if (!Array.isArray(player[key])) player[key] = [];
  return player[key];
}

function togglePlayerShrinePerk(player, perkFile, role = currentRole) {
  if (!player || !perkFile) return false;
  const list = getPlayerShrinePerks(player, role);
  const idx = list.indexOf(perkFile);
  if (idx >= 0) {
    list.splice(idx, 1);
    return false;
  } else {
    list.push(perkFile);
    return true;
  }
}

function getPlayerPerkUnlockStatus(player, perkFile, charId = null, role = currentRole) {
  if (!perkFile) {
    return { unlocked: false, source: 'locked', label: 'Kein Perk' };
  }
  const info = getPerkInfo(perkFile);
  if (!info) {
    return { unlocked: false, source: 'locked', label: 'Unbekannt' };
  }
  if (info.isGeneral) {
    return { unlocked: true, source: 'general', label: '⭐ ' + t('perkGeneralName') };
  }
  if (charId && info.ownerId === charId) {
    return { unlocked: true, source: 'own', label: `🏅 Eigener Charakter-Perk (${info.ownerTitle})` };
  }
  if (player) {
    const ownerPrestige = getPlayerPrestige(player, info.ownerId, role);
    if (ownerPrestige >= 1) {
      return {
        unlocked: true,
        source: 'prestige',
        prestige: ownerPrestige,
        label: `👑 Prestige ${ownerPrestige} (${info.ownerTitle})`
      };
    }
    const shrinePerks = getPlayerShrinePerks(player, role);
    if (shrinePerks.includes(perkFile)) {
      return { unlocked: true, source: 'shrine', label: '⛩️ Schrein der Geheimnisse' };
    }
  }
  return {
    unlocked: false,
    source: 'locked',
    label: `🔒 Gesperrt (${info.ownerTitle} ist P0)`
  };
}

function isPerkUnlockedForPlayer(player, perkFile, charId = null, role = currentRole) {
  const status = getPlayerPerkUnlockStatus(player, perkFile, charId, role);
  return status.unlocked;
}

function getPlayerAvailablePerks(player, charId = null, role = currentRole) {
  const rolePerks = getRolePerks(role);
  if (!player) return rolePerks;
  return rolePerks.filter(p => isPerkUnlockedForPlayer(player, p.file, charId, role));
}

/* ==================== INITIALIZATION & PERSISTENCE ==================== */
document.addEventListener('DOMContentLoaded', () => {
  loadPortraitCache();
  loadAllState();
  if (typeof applyStaticTranslations === 'function') {
    applyStaticTranslations();
  }
  bindEvents();
  renderAll();
  fetchWikiAssets();
});

function saveAllState() {
  try {
    const payload = {
      currentRole,
      currentActiveView,
      selectedPlayerEditorId,
      sharedPlayers,
      tournamentData
    };
    localStorage.setItem(STORAGE_KEY_PREFIX + 'state', JSON.stringify(payload));
  } catch (e) {
    console.warn('Could not save state to localStorage', e);
  }
}

function loadPortraitCache() {
  try {
    const raw = localStorage.getItem(PORTRAIT_CACHE_KEY);
    if (raw) wikiPortraitCache = JSON.parse(raw) || {};
  } catch (e) {
    wikiPortraitCache = {};
  }
}

function savePortraitCache() {
  try {
    localStorage.setItem(PORTRAIT_CACHE_KEY, JSON.stringify(wikiPortraitCache));
  } catch (e) {
    // ignore
  }
}

function loadAllState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + 'state');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.currentRole) currentRole = parsed.currentRole;
      if (parsed.currentActiveView) currentActiveView = parsed.currentActiveView;
      if (parsed.sharedPlayers && parsed.sharedPlayers.length > 0) {
        sharedPlayers = parsed.sharedPlayers;
        // Ensure both ownedKillerIds & ownedSurvivorIds exist on every player
        sharedPlayers.forEach(p => {
          if (!p.ownedKillerIds) p.ownedKillerIds = DEFAULT_KILLERS.map(k => k.id);
          if (!p.ownedSurvivorIds) p.ownedSurvivorIds = DEFAULT_SURVIVORS.map(s => s.id);
          if (!p.killerPrestige || typeof p.killerPrestige !== 'object') {
            p.killerPrestige = {};
            p.ownedKillerIds.forEach(id => { p.killerPrestige[id] = 3; });
          }
          if (!p.survivorPrestige || typeof p.survivorPrestige !== 'object') {
            p.survivorPrestige = {};
            p.ownedSurvivorIds.forEach(id => { p.survivorPrestige[id] = 3; });
          }
          if (!Array.isArray(p.unlockedKillerPerks)) p.unlockedKillerPerks = [];
          if (!Array.isArray(p.unlockedSurvivorPerks)) p.unlockedSurvivorPerks = [];
        });
      }
      if (parsed.tournamentData) {
        if (parsed.tournamentData.killer) tournamentData.killer = parsed.tournamentData.killer;
        if (parsed.tournamentData.survivor) tournamentData.survivor = parsed.tournamentData.survivor;
      }
      if (parsed.selectedPlayerEditorId) selectedPlayerEditorId = parsed.selectedPlayerEditorId;
    } else {
      // Legacy v2 migration check
      const oldV2 = localStorage.getItem('dbd_world_cup_state_v2') || localStorage.getItem('dbd_world_cup_state_v1');
      if (oldV2) {
        const parsedOld = JSON.parse(oldV2);
        if (parsedOld.killers) tournamentData.killer.characters = parsedOld.killers;
        if (parsedOld.selectedIds) tournamentData.killer.selectedIds = parsedOld.selectedIds;
        if (parsedOld.config) tournamentData.killer.config = parsedOld.config;
        if (parsedOld.groups) tournamentData.killer.groups = parsedOld.groups;
        if (parsedOld.bracket) tournamentData.killer.bracket = parsedOld.bracket;
        if (parsedOld.tournamentStarted) tournamentData.killer.tournamentStarted = parsedOld.tournamentStarted;
        if (parsedOld.players) {
          sharedPlayers = parsedOld.players.map(p => ({
            ...p,
            ownedKillerIds: p.ownedKillerIds || DEFAULT_KILLERS.map(k => k.id),
            ownedSurvivorIds: DEFAULT_SURVIVORS.map(s => s.id),
            killerPrestige: p.killerPrestige || {},
            survivorPrestige: p.survivorPrestige || {},
            unlockedKillerPerks: p.unlockedKillerPerks || [],
            unlockedSurvivorPerks: p.unlockedSurvivorPerks || []
          }));
        }
      }
    }
  } catch (e) {
    console.warn('Error loading state', e);
  }

  // Ensure default characters list contains all items
  syncCharacterList('killer', DEFAULT_KILLERS);
  syncCharacterList('survivor', DEFAULT_SURVIVORS);

  if (!tournamentData.killer.config.perkMode) tournamentData.killer.config.perkMode = 'random';
  if (!tournamentData.survivor.config.perkMode) tournamentData.survivor.config.perkMode = 'random';
  if (!tournamentData.killer.config.itemAddonMode) tournamentData.killer.config.itemAddonMode = 'random';
  if (!tournamentData.survivor.config.itemAddonMode) tournamentData.survivor.config.itemAddonMode = 'random';
  if (!tournamentData.killer.config.itemPoolMode) tournamentData.killer.config.itemPoolMode = 'basis';
  if (!tournamentData.survivor.config.itemPoolMode) tournamentData.survivor.config.itemPoolMode = 'basis';
}

function syncCharacterList(role, defaultList) {
  const currentList = tournamentData[role].characters || [];
  const existingMap = {};
  currentList.forEach(c => { existingMap[c.id] = c; });
  const merged = defaultList.map(def => ({
    ...def,
    ...(existingMap[def.id] || {}),
    legacy: def.legacy,
    assetPath: def.assetPath,
    adeptPerks: def.adeptPerks || []
  }));
  // Keep custom additions
  currentList.forEach(c => {
    if (c.id.startsWith('custom_') && !merged.some(m => m.id === c.id)) {
      merged.push(c);
    }
  });
  tournamentData[role].characters = merged;
  if (!tournamentData[role].selectedIds || tournamentData[role].selectedIds.length === 0) {
    tournamentData[role].selectedIds = merged.map(c => c.id);
  } else {
    // Also select any newly added default characters that weren't in the old list yet
    defaultList.forEach(def => {
      if (!existingMap[def.id] && !tournamentData[role].selectedIds.includes(def.id)) {
        tournamentData[role].selectedIds.push(def.id);
      }
    });
  }

  // Ensure players own any newly added default characters by default
  sharedPlayers.forEach(p => {
    const ownedArr = role === 'killer' ? p.ownedKillerIds : p.ownedSurvivorIds;
    if (Array.isArray(ownedArr)) {
      defaultList.forEach(def => {
        if (!existingMap[def.id] && !ownedArr.includes(def.id)) {
          ownedArr.push(def.id);
        }
      });
    }
  });
}

/* ==================== PERK CATALOG & PERK MODE SYSTEM ==================== */
function formatPerkDisplayName(perkFile) {
  if (!perkFile) return '';
  const base = perkFile.replace(/\.(webp|png)$/i, '');
  return base
    .replace(/^Hex\s+/i, 'Hex: ')
    .replace(/^Boon\s+/i, 'Boon: ')
    .replace(/^Scourge Hook\s+/i, 'Scourge Hook: ')
    .replace(/^Invocation\s+/i, 'Invocation: ')
    .replace(/^Teamwork\s+/i, 'Teamwork: ');
}

function buildRolePerkCatalog(role) {
  const chars = role === 'killer' ? DEFAULT_KILLERS : DEFAULT_SURVIVORS;
  const generalFiles = role === 'killer' ? GENERAL_KILLER_PERKS : GENERAL_SURVIVOR_PERKS;
  const list = [];

  chars.forEach(c => {
    (c.adeptPerks || []).forEach(file => {
      list.push({
        file,
        name: formatPerkDisplayName(file),
        path: `Assets/Icons/Perks/${file}`,
        role,
        ownerId: c.id,
        ownerTitle: c.title,
        isGeneral: false
      });
    });
  });

  generalFiles.forEach(file => {
    list.push({
      file,
      name: formatPerkDisplayName(file),
      path: `Assets/Icons/Perks/${file}`,
      role,
      ownerId: 'general',
      ownerTitle: role === 'killer' ? 'Allgemeiner Killer-Perk' : 'Allgemeiner Survivor-Perk',
      isGeneral: true
    });
  });

  return list.sort((a, b) => a.name.localeCompare(b.name));
}

const PERK_CATALOG = {
  killer: buildRolePerkCatalog('killer'),
  survivor: buildRolePerkCatalog('survivor')
};

const PERK_LOOKUP = {};
[...PERK_CATALOG.killer, ...PERK_CATALOG.survivor].forEach(p => {
  PERK_LOOKUP[p.file] = p;
});

function getRolePerks(role = currentRole) {
  return PERK_CATALOG[role] || [];
}

function getPerkInfo(perkFile) {
  if (!perkFile) return null;
  if (PERK_LOOKUP[perkFile]) return PERK_LOOKUP[perkFile];
  return {
    file: perkFile,
    name: formatPerkDisplayName(perkFile),
    path: `Assets/Icons/Perks/${perkFile}`,
    role: currentRole,
    ownerId: 'general',
    ownerTitle: 'Perk',
    isGeneral: true
  };
}

function rollRandomPerksForSide(role = currentRole, count = 4, excludeFiles = [], player = null, charId = null) {
  let pool = [];
  if (player) {
    const available = getPlayerAvailablePerks(player, charId, role).map(p => p.file);
    pool = available.filter(f => !excludeFiles.includes(f));
    // If available unlocked pool has fewer than count perks, supplement from role perks
    if (pool.length < count) {
      const allRoleFiles = getRolePerks(role).map(p => p.file).filter(f => !excludeFiles.includes(f));
      const needed = allRoleFiles.filter(f => !pool.includes(f));
      pool = [...pool, ...needed];
    }
  } else {
    pool = getRolePerks(role)
      .map(p => p.file)
      .filter(f => !excludeFiles.includes(f));
  }
  const shuffled = shuffleArray([...pool]);
  return shuffled.slice(0, count);
}

function getCharacterAdeptPerks(charId) {
  const c = getCharacter(charId);
  if (c && Array.isArray(c.adeptPerks) && c.adeptPerks.length > 0) {
    return [...c.adeptPerks];
  }
  return [];
}

function ensureMatchPerks(match, role = currentRole) {
  if (!match) return;
  const pA = getPlayer(match.playerA);
  const pB = getPlayer(match.playerB);
  if (!Array.isArray(match.randomPerksA) || match.randomPerksA.length !== 4) {
    match.randomPerksA = rollRandomPerksForSide(role, 4, [], pA, match.killerA);
  }
  if (!Array.isArray(match.randomPerksB) || match.randomPerksB.length !== 4) {
    match.randomPerksB = rollRandomPerksForSide(role, 4, [], pB, match.killerB);
  }
  if (!Array.isArray(match.customPerksA) || match.customPerksA.length !== 4) {
    match.customPerksA = [null, null, null, null];
  }
  if (!Array.isArray(match.customPerksB) || match.customPerksB.length !== 4) {
    match.customPerksB = [null, null, null, null];
  }
}

function ensureAllMatchesHavePerks(role = currentRole) {
  const tourney = tournamentData[role];
  if (!tourney) return;
  const allMatches = [
    ...(tourney.groups || []).flatMap(g => g.matches || []),
    ...((tourney.bracket && tourney.bracket.rounds) || []).flatMap(r => r.matches || []),
    ...(tourney.bracket && tourney.bracket.thirdPlace ? [tourney.bracket.thirdPlace] : [])
  ];
  allMatches.forEach(m => {
    ensureMatchPerks(m, role);
    ensureMatchItemAddons(m, role);
  });
}

function getEffectiveMatchPerks(match, side, role = currentRole) {
  if (!match) return [];
  ensureMatchPerks(match, role);
  const perkMode = (tournamentData[role]?.config?.perkMode) || 'random';
  const charId = side === 'A' ? match.killerA : match.killerB;
  if (!charId) return [];

  if (perkMode === 'perkless') {
    return [];
  }
  if (perkMode === 'adept') {
    return getCharacterAdeptPerks(charId);
  }
  if (perkMode === 'custom') {
    const arr = side === 'A' ? match.customPerksA : match.customPerksB;
    return (arr || []).filter(Boolean);
  }
  // default: 'random'
  return (side === 'A' ? match.randomPerksA : match.randomPerksB).filter(Boolean);
}

function renderMiniPerkStripHtml(match, side) {
  const perkMode = getCurrentConfig().perkMode || 'random';
  if (perkMode === 'perkless') return '';
  const perks = getEffectiveMatchPerks(match, side, currentRole);
  if (!perks || perks.length === 0) return '';
  return `
    <div class="match-mini-perks">
      ${perks.map(file => {
        const info = getPerkInfo(file);
        return `<img src="${escapeHtml(info.path)}" alt="${escapeHtml(info.name)}" title="${escapeHtml(info.name)} (${escapeHtml(info.ownerTitle)})" class="mini-perk-icon" loading="lazy" />`;
      }).join('')}
    </div>
  `;
}

function updatePerkModeDescription() {
  const mode = getCurrentConfig().perkMode || 'random';
  const descEl = document.getElementById('perkModeDesc');
  if (descEl) descEl.textContent = PERK_MODES[mode] || '';
}

/* ==================== ITEMS & ADDONS HELPERS & RANDOMIZER ==================== */
function formatItemAddonDisplayName(str) {
  if (!str) return '';
  let name = str.split('/').pop().split('\\').pop().replace(/\.[^/.]+$/, '');

  // Strip Unreal Engine / DBD asset prefixes
  name = name.replace(/^T_UI_(hud_umg_survivorMagicItems_|iconItems_|iconAddons?_)?/i, '');
  name = name.replace(/^hud_umg_survivorMagicItems_/i, '');
  name = name.replace(/^iconItems_/i, '');
  name = name.replace(/^iconAddons?_/i, '');
  name = name.replace(/^icons_/i, '');
  name = name.replace(/^T_UI_/i, '');

  // Separate camelCase / PascalCase and numbers
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  name = name.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  name = name.replace(/([a-zA-Z])([0-9]+)/g, '$1 $2');
  name = name.replace(/([0-9]+)([a-zA-Z])/g, '$1 $2');

  // Replace underscores, hyphens, and multiple spaces
  name = name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  // Capitalize each word properly
  return name.split(' ').map(w => {
    if (!w) return '';
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

function getItemInfo(pathOrFile) {
  if (!pathOrFile) return null;
  const catalog = (typeof SURVIVOR_ITEMS_CATALOG !== 'undefined') ? SURVIVOR_ITEMS_CATALOG : [];
  const found = catalog.find(i => i.path === pathOrFile || i.file === pathOrFile || i.path.endsWith('/' + pathOrFile));
  if (found) {
    return {
      path: found.path,
      file: found.file,
      name: formatItemAddonDisplayName(found.file),
      type: found.type,
      isEvent: !!found.isEvent
    };
  }
  return {
    path: pathOrFile,
    file: pathOrFile.split('/').pop(),
    name: formatItemAddonDisplayName(pathOrFile),
    type: 'misc',
    isEvent: false
  };
}

function getAddonInfo(pathOrFile, role = currentRole, killerId = null) {
  if (!pathOrFile) return null;
  if (role === 'survivor') {
    const catalog = (typeof SURVIVOR_ADDONS_CATALOG !== 'undefined') ? SURVIVOR_ADDONS_CATALOG : [];
    const found = catalog.find(a => a.path === pathOrFile || a.file === pathOrFile || a.path.endsWith('/' + pathOrFile));
    if (found) {
      return {
        path: found.path,
        file: found.file,
        name: formatItemAddonDisplayName(found.file),
        type: found.type,
        isEvent: !!found.isEvent
      };
    }
  }
  // Killer Addon
  return {
    path: pathOrFile,
    file: pathOrFile.split('/').pop(),
    name: formatItemAddonDisplayName(pathOrFile),
    type: killerId || 'killer',
    isEvent: false
  };
}

function getSurvivorItems(poolMode = 'basis') {
  if (typeof SURVIVOR_ITEMS_CATALOG === 'undefined') return [];
  if (poolMode === 'events') {
    return SURVIVOR_ITEMS_CATALOG;
  }
  return SURVIVOR_ITEMS_CATALOG.filter(it => !it.isEvent);
}

function getSurvivorAddonsForItem(itemPath) {
  if (!itemPath || typeof SURVIVOR_ADDONS_CATALOG === 'undefined') return [];
  const itemInfo = getItemInfo(itemPath);
  if (!itemInfo || !itemInfo.type) return [];
  if (itemInfo.type === 'firecracker' || itemInfo.type === 'fogvial') return [];
  return SURVIVOR_ADDONS_CATALOG.filter(a => a.type === itemInfo.type);
}

function rollRandomSurvivorAddonsForItem(itemPath, count = 2, excludeAddons = []) {
  const addonsPool = getSurvivorAddonsForItem(itemPath);
  if (addonsPool.length === 0) return [null, null].slice(0, count);
  const pool = addonsPool.map(a => a.path).filter(p => !excludeAddons.includes(p));
  const source = pool.length > 0 ? pool : addonsPool.map(a => a.path);
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  const chosen = shuffled.slice(0, count);
  while (chosen.length < count) {
    chosen.push(null);
  }
  return chosen;
}

function rollRandomSurvivorItemAndAddons(poolMode = 'basis', excludeItem = null) {
  const items = getSurvivorItems(poolMode);
  if (items.length === 0) return { item: null, addons: [null, null] };
  const pool = excludeItem ? items.filter(it => it.path !== excludeItem) : items;
  const pickedItem = (pool.length > 0 ? pool : items)[Math.floor(Math.random() * (pool.length > 0 ? pool.length : items.length))];
  const addons = rollRandomSurvivorAddonsForItem(pickedItem.path, 2);
  return {
    item: pickedItem.path,
    addons
  };
}

function rollRandomKillerAddons(killerId, count = 2, excludeAddons = []) {
  if (!killerId) return [null, null].slice(0, count);
  const list = (typeof KILLER_ADDONS_CATALOG !== 'undefined' && KILLER_ADDONS_CATALOG[killerId])
    ? [...KILLER_ADDONS_CATALOG[killerId]]
    : [];
  if (list.length === 0) return [null, null].slice(0, count);
  const pool = list.filter(p => !excludeAddons.includes(p));
  const source = pool.length > 0 ? pool : list;
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  const chosen = shuffled.slice(0, count);
  while (chosen.length < count) {
    chosen.push(null);
  }
  return chosen;
}

function ensureMatchItemAddons(match, role = currentRole) {
  if (!match) return;
  const poolMode = (tournamentData[role]?.config?.itemPoolMode) || 'basis';

  if (role === 'killer') {
    match.randomItemA = null;
    match.randomItemB = null;
    match.customItemA = null;
    match.customItemB = null;

    if (!Array.isArray(match.randomAddonsA) || match.randomAddonsA.length !== 2) {
      match.randomAddonsA = rollRandomKillerAddons(match.killerA, 2);
    }
    if (!Array.isArray(match.randomAddonsB) || match.randomAddonsB.length !== 2) {
      match.randomAddonsB = rollRandomKillerAddons(match.killerB, 2);
    }
    if (!Array.isArray(match.customAddonsA) || match.customAddonsA.length !== 2) {
      match.customAddonsA = [null, null];
    }
    if (!Array.isArray(match.customAddonsB) || match.customAddonsB.length !== 2) {
      match.customAddonsB = [null, null];
    }
  } else {
    // Survivor
    if (!match.randomItemA) {
      const rolledA = rollRandomSurvivorItemAndAddons(poolMode);
      match.randomItemA = rolledA.item;
      match.randomAddonsA = rolledA.addons;
    } else if (!Array.isArray(match.randomAddonsA) || match.randomAddonsA.length !== 2) {
      match.randomAddonsA = rollRandomSurvivorAddonsForItem(match.randomItemA, 2);
    }

    if (!match.randomItemB) {
      const rolledB = rollRandomSurvivorItemAndAddons(poolMode);
      match.randomItemB = rolledB.item;
      match.randomAddonsB = rolledB.addons;
    } else if (!Array.isArray(match.randomAddonsB) || match.randomAddonsB.length !== 2) {
      match.randomAddonsB = rollRandomSurvivorAddonsForItem(match.randomItemB, 2);
    }

    if (match.customItemA === undefined) match.customItemA = null;
    if (match.customItemB === undefined) match.customItemB = null;
    if (!Array.isArray(match.customAddonsA) || match.customAddonsA.length !== 2) {
      match.customAddonsA = [null, null];
    }
    if (!Array.isArray(match.customAddonsB) || match.customAddonsB.length !== 2) {
      match.customAddonsB = [null, null];
    }
  }
}

function getEffectiveMatchItemAndAddons(match, side, role = currentRole) {
  if (!match) return { item: null, addons: [] };
  ensureMatchItemAddons(match, role);
  const mode = (tournamentData[role]?.config?.itemAddonMode) || 'random';
  if (mode === 'none') {
    return { item: null, addons: [] };
  }
  if (mode === 'custom') {
    const it = side === 'A' ? match.customItemA : match.customItemB;
    const adds = (side === 'A' ? match.customAddonsA : match.customAddonsB) || [];
    return {
      item: role === 'survivor' ? it : null,
      addons: adds.filter(Boolean)
    };
  }
  // 'random'
  const it = side === 'A' ? match.randomItemA : match.randomItemB;
  const adds = (side === 'A' ? match.randomAddonsA : match.randomAddonsB) || [];
  return {
    item: role === 'survivor' ? it : null,
    addons: adds.filter(Boolean)
  };
}

function renderMiniItemAddonStripHtml(match, side) {
  const itemAddonMode = getCurrentConfig().itemAddonMode || 'random';
  if (itemAddonMode === 'none') return '';
  const { item, addons } = getEffectiveMatchItemAndAddons(match, side, currentRole);
  if (!item && (!addons || addons.length === 0)) return '';

  let html = '<div class="match-mini-items">';
  if (currentRole === 'survivor' && item) {
    const itemInfo = getItemInfo(item);
    html += `<img src="${escapeHtml(itemInfo.path)}" alt="${escapeHtml(itemInfo.name)}" title="${escapeHtml(itemInfo.name)}" class="mini-item-icon" loading="lazy" />`;
  }
  if (addons && addons.length > 0) {
    const charId = side === 'A' ? match.killerA : match.killerB;
    addons.forEach(addPath => {
      const addInfo = getAddonInfo(addPath, currentRole, charId);
      html += `<img src="${escapeHtml(addInfo.path)}" alt="${escapeHtml(addInfo.name)}" title="${escapeHtml(addInfo.name)}" class="mini-addon-icon" loading="lazy" />`;
    });
  }
  html += '</div>';
  return html;
}

function updateItemAddonModeDescription() {
  const mode = getCurrentConfig().itemAddonMode || 'random';
  const descEl = document.getElementById('itemAddonModeDesc');
  if (descEl) descEl.textContent = ITEM_ADDON_MODES[mode] || '';
}

function updateItemPoolModeDescription() {
  const mode = getCurrentConfig().itemPoolMode || 'basis';
  const descEl = document.getElementById('itemPoolModeDesc');
  if (descEl) descEl.textContent = ITEM_POOL_MODES[mode] || '';

  const poolGroup = document.getElementById('selectItemPoolMode')?.closest('.config-group');
  if (poolGroup) {
    poolGroup.style.display = currentRole === 'killer' ? 'none' : '';
  }
}

/* ==================== LOCAL ASSETS PORTRAIT & LOGO LOADER ==================== */
/**
 * Uses the local Assets folder directly:
 * - Header: Assets/Header/DBD Logo.png, Assets/Header/Killer Logo.webp, Assets/Header/Survivor Logo.webp
 * - Killer Icons: Assets/Icons/Killer/<Name>.webp
 * - Survivor Icons: Assets/Icons/Survivor/<Name>.webp
 */
function fetchWikiAssets() {
  applyHeaderWikiLogo();
}

function applyHeaderWikiLogo() {
  const modeLogoImg = document.getElementById('headerModeLogo');
  if (!modeLogoImg) return;

  modeLogoImg.src = currentRole === 'killer'
    ? 'Assets/Header/Killer Logo.webp'
    : 'Assets/Header/Survivor Logo.webp';
  modeLogoImg.alt = currentRole === 'killer' ? 'Killer Logo' : 'Survivor Logo';
}

/** Returns the local asset path for a Killer or Survivor. */
function getCharacterPortraitUrl(character) {
  const charObj = typeof character === 'string' ? getCharacter(character) : character;
  if (!charObj) return null;
  if (charObj.assetPath) return charObj.assetPath;
  if (charObj.title && charObj.id !== 'tbd') {
    const folder = currentRole === 'killer' ? 'Killer' : 'Survivor';
    return `Assets/Icons/${folder}/${charObj.title}.webp`;
  }
  return null;
}

/** On load error: show the emoji placeholder. */
function handleImageErrorWithFallback(imgElement) {
  imgElement.style.display = 'none';
  if (imgElement.nextElementSibling) {
    imgElement.nextElementSibling.style.display = 'inline';
  }
}

function renderCharacterAvatarHtml(character, sizeClass = 'killer-avatar') {
  const url = getCharacterPortraitUrl(character);
  const bgStyle = `background: radial-gradient(circle at 30% 30%, ${character.color}55, #0a0b0e);`;
  if (url) {
    return `
      <div class="${sizeClass}" style="${bgStyle}">
        <img src="${escapeHtml(url)}" alt="${escapeHtml(character.title)}" class="killer-portrait-img" loading="lazy"
             onerror="handleImageErrorWithFallback(this)" />
        <span style="display:none">${character.icon}</span>
      </div>
    `;
  }
  return `
    <div class="${sizeClass}" style="${bgStyle}">
      <span>${character.icon}</span>
    </div>
  `;
}

/* ==================== SMART PLAYER ASSIGNMENT ALGORITHM ==================== */
function assignPlayersToAllMatches(overwriteExisting = false) {
  const activePlayers = getActivePlayers();
  if (activePlayers.length === 0) return;

  const playerTotalCount = {};
  const playerCharCount = {};
  const pairMatchupCount = {};

  activePlayers.forEach(p => {
    playerTotalCount[p.id] = 0;
    playerCharCount[p.id] = {};
  });

  const recordAssignment = (pA, pB, cA, cB) => {
    if (pA && playerTotalCount[pA] !== undefined) {
      playerTotalCount[pA]++;
      if (cA) playerCharCount[pA][cA] = (playerCharCount[pA][cA] || 0) + 1;
    }
    if (pB && playerTotalCount[pB] !== undefined) {
      playerTotalCount[pB]++;
      if (cB) playerCharCount[pB][cB] = (playerCharCount[pB][cB] || 0) + 1;
    }
    if (pA && pB) {
      const pairKey = [pA, pB].sort().join('__');
      pairMatchupCount[pairKey] = (pairMatchupCount[pairKey] || 0) + 1;
    }
  };

  const tourney = getCurrentTournament();
  const allMatches = [
    ...tourney.groups.flatMap(g => g.matches),
    ...(tourney.bracket.rounds || []).flatMap(r => r.matches),
    ...(tourney.bracket.thirdPlace ? [tourney.bracket.thirdPlace] : [])
  ];

  allMatches.forEach(m => {
    if ((m.played || !overwriteExisting) && m.playerA && m.playerB) {
      recordAssignment(m.playerA, m.playerB, m.killerA, m.killerB);
    }
  });

  allMatches.forEach(m => {
    if (!m.killerA || !m.killerB) return;
    if (!overwriteExisting && m.playerA && m.playerB) return;
    if (m.played && !overwriteExisting) return;

    const bestPair = pickBestPlayerPairForMatch(
      m.killerA,
      m.killerB,
      activePlayers,
      playerTotalCount,
      playerCharCount,
      pairMatchupCount
    );

    m.playerA = bestPair.playerA;
    m.playerB = bestPair.playerB;
    recordAssignment(m.playerA, m.playerB, m.killerA, m.killerB);
  });
}

function pickBestPlayerPairForMatch(charAId, charBId, activePlayers, playerTotalCount, playerCharCount, pairMatchupCount) {
  if (activePlayers.length === 1) {
    return { playerA: activePlayers[0].id, playerB: activePlayers[0].id };
  }

  const ownsChar = (player, cId) => {
    const owned = getPlayerOwnedIds(player, currentRole);
    return owned.includes(cId);
  };

  let candidates = [];

  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = 0; j < activePlayers.length; j++) {
      if (i === j) continue;
      const pA = activePlayers[i];
      const pB = activePlayers[j];

      const ownA = ownsChar(pA, charAId);
      const ownB = ownsChar(pB, charBId);
      const ownershipScore = (ownA ? 1000 : 0) + (ownB ? 1000 : 0);

      const loadPenalty = (playerTotalCount[pA.id] || 0) * 15 + (playerTotalCount[pB.id] || 0) * 15;
      const repeatCharPenalty =
        ((playerCharCount[pA.id]?.[charAId] || 0) * 25) +
        ((playerCharCount[pB.id]?.[charBId] || 0) * 25);

      const pairKey = [pA.id, pB.id].sort().join('__');
      const pairPenalty = (pairMatchupCount[pairKey] || 0) * 6;
      const jitter = Math.random() * 2;

      const totalScore = ownershipScore - loadPenalty - repeatCharPenalty - pairPenalty + jitter;
      candidates.push({
        playerA: pA.id,
        playerB: pB.id,
        totalScore
      });
    }
  }

  candidates.sort((a, b) => b.totalScore - a.totalScore);
  return candidates[0] || { playerA: activePlayers[0].id, playerB: activePlayers[1]?.id || activePlayers[0].id };
}

/* ==================== EVENT BINDINGS ==================== */
function bindEvents() {
  // Language Selector Buttons
  document.querySelectorAll('#langSelector .lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });
  document.querySelectorAll('#langSelector .lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === getCurrentLanguage());
  });

  // Role Switcher (Killer vs Survivor)
  document.getElementById('btnRoleKiller').addEventListener('click', () => switchTournamentRole('killer'));
  document.getElementById('btnRoleSurvivor').addEventListener('click', () => switchTournamentRole('survivor'));

  // Phase Navigation
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      switchView(btn.dataset.view);
    });
  });

  document.getElementById('btnGotoPlayers').addEventListener('click', () => switchView('players'));

  // Quick Presets
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });

  // Config Selects
  const selGroupSize = document.getElementById('selectGroupSize');
  const selAdvance = document.getElementById('selectAdvanceCount');
  const selScoring = document.getElementById('selectScoringMode');
  const selPerkMode = document.getElementById('selectPerkMode');
  const selThird = document.getElementById('selectThirdPlace');

  selGroupSize.addEventListener('change', e => {
    getCurrentConfig().groupSize = parseInt(e.target.value, 10);
    saveAllState();
    renderSetupPreview();
  });
  selAdvance.addEventListener('change', e => {
    getCurrentConfig().advanceMode = e.target.value;
    saveAllState();
    renderSetupPreview();
  });
  selScoring.addEventListener('change', e => {
    getCurrentConfig().scoringMode = e.target.value;
    updateScoringModeDescription();
    saveAllState();
    renderAll();
  });
  if (selPerkMode) {
    selPerkMode.addEventListener('change', e => {
      getCurrentConfig().perkMode = e.target.value;
      updatePerkModeDescription();
      ensureAllMatchesHavePerks(currentRole);
      saveAllState();
      renderAll();
    });
  }

  const selItemAddonMode = document.getElementById('selectItemAddonMode');
  if (selItemAddonMode) {
    selItemAddonMode.addEventListener('change', e => {
      getCurrentConfig().itemAddonMode = e.target.value;
      updateItemAddonModeDescription();
      ensureAllMatchesHavePerks(currentRole);
      saveAllState();
      renderAll();
    });
  }

  const selItemPoolMode = document.getElementById('selectItemPoolMode');
  if (selItemPoolMode) {
    selItemPoolMode.addEventListener('change', e => {
      getCurrentConfig().itemPoolMode = e.target.value;
      updateItemPoolModeDescription();
      saveAllState();
      renderAll();
    });
  }
  selThird.addEventListener('change', e => {
    getCurrentConfig().thirdPlaceMatch = e.target.value === 'yes';
    saveAllState();
  });

  // Search & Filter
  document.getElementById('searchKiller').addEventListener('input', renderCharacterGrid);
  document.getElementById('filterCategory').addEventListener('change', renderCharacterGrid);

  // Random Pick
  document.getElementById('btnRandomPick').addEventListener('click', () => {
    const roster = getCurrentRoster();
    const countStr = prompt(`${t('promptRandomPickCount')} (4 - ${roster.length})`, '32');
    if (!countStr) return;
    const count = Math.max(4, Math.min(roster.length, parseInt(countStr, 10) || 32));
    const shuffled = shuffleArray([...roster]);
    getCurrentTournament().selectedIds = shuffled.slice(0, count).map(c => c.id);
    saveAllState();
    renderCharacterGrid();
    renderSetupPreview();
  });

  // Add Custom Character
  document.getElementById('btnAddCustomKiller').addEventListener('click', addCustomCharacter);

  // Player Profile Management Buttons
  document.getElementById('btnAddPlayerProfile').addEventListener('click', addNewPlayerProfile);
  document.getElementById('btnRebalanceAssignments').addEventListener('click', () => {
    assignPlayersToAllMatches(true);
    saveAllState();
    renderAll();
    alert(t('alertReassignSuccess'));
  });

  // Start Tournament / Manual Groups
  document.getElementById('btnStartTournament').addEventListener('click', () => {
    const selected = getCurrentSelectedIds();
    if (selected.length < 4) {
      alert(t('alertMin4Required'));
      return;
    }
    const tourney = getCurrentTournament();
    if (tourney.tournamentStarted) {
      if (!confirm(t('confirmRestartTournament'))) {
        return;
      }
    }
    generateGroupsFromSelection(true);
    startTournamentWithCurrentGroups();
  });

  document.getElementById('btnManualGroups').addEventListener('click', () => {
    const selected = getCurrentSelectedIds();
    if (selected.length < 4) {
      alert(t('alertMin4Required'));
      return;
    }
    const tourney = getCurrentTournament();
    if (!tourney.groups.length || !doGroupsMatchSelection()) {
      generateGroupsFromSelection(true);
    }
    openGroupEditorModal();
  });

  // Group Stage Toolbar Buttons
  document.getElementById('btnRedrawGroups').addEventListener('click', () => {
    if (confirm(t('confirmRerollGroups'))) {
      generateGroupsFromSelection(true);
      startTournamentWithCurrentGroups();
    }
  });

  document.getElementById('btnSimAllGroups').addEventListener('click', simulateRemainingGroupMatches);

  document.getElementById('btnAdvanceToKO').addEventListener('click', () => {
    buildKnockoutBracket();
    saveAllState();
    switchView('bracket');
  });

  // Bracket Toolbar Buttons
  document.getElementById('btnSimCurrentRound').addEventListener('click', simulateActiveKnockoutRound);
  document.getElementById('btnRegenerateKO').addEventListener('click', () => {
    if (confirm(t('confirmRebuildKo'))) {
      buildKnockoutBracket();
      saveAllState();
      renderBracketView();
    }
  });

  // Header Actions (Export, Import, Reset)
  document.getElementById('btnExport').addEventListener('click', exportTournamentJson);
  document.getElementById('inputImport').addEventListener('change', importTournamentJson);
  document.getElementById('btnResetTournament').addEventListener('click', () => {
    if (confirm(t('confirmResetTournament'))) {
      const tourney = getCurrentTournament();
      tourney.tournamentStarted = false;
      tourney.groups = [];
      tourney.bracket = { rounds: [], thirdPlace: null };
      tourney.selectedIds = tourney.characters.map(c => c.id);
      saveAllState();
      switchView('setup');
      renderAll();
    }
  });

  // Match Modal Controls
  document.getElementById('btnCloseModal').addEventListener('click', closeMatchModal);
  document.getElementById('btnCancelModal').addEventListener('click', closeMatchModal);
  document.getElementById('btnSaveMatchResult').addEventListener('click', saveMatchModalResult);
  document.getElementById('btnClearMatchResult').addEventListener('click', clearMatchModalResult);
  document.getElementById('btnSimulateSingleMatch').addEventListener('click', simulateModalMatch);

  document.getElementById('selectModalPlayerA').addEventListener('change', checkModalPlayerOwnershipWarnings);
  document.getElementById('selectModalPlayerB').addEventListener('change', checkModalPlayerOwnershipWarnings);
  document.getElementById('btnSwapMatchPlayers').addEventListener('click', () => {
    const selA = document.getElementById('selectModalPlayerA');
    const selB = document.getElementById('selectModalPlayerB');
    const tmp = selA.value;
    selA.value = selB.value;
    selB.value = tmp;
    checkModalPlayerOwnershipWarnings();
  });

  // Stepper Stat 2
  document.querySelectorAll('#stepperStat2A .step-btn, #stepperStat2B .step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      const delta = parseInt(btn.dataset.delta, 10);
      const input = document.getElementById(`inputHooks${side}`);
      const maxVal = getStatMax(2);
      const cur = parseInt(input.value, 10) || 0;
      input.value = Math.max(0, Math.min(maxVal, cur + delta));
      updateModalLiveVerdict();
    });
  });

  ['inputKillsA', 'inputKillsB', 'inputHooksA', 'inputHooksB'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateModalLiveVerdict);
  });

  document.getElementById('btnTieWinnerA').addEventListener('click', () => {
    editingTieWinner = 'A';
    updateModalLiveVerdict();
  });
  document.getElementById('btnTieWinnerB').addEventListener('click', () => {
    editingTieWinner = 'B';
    updateModalLiveVerdict();
  });

  // Group Editor Modal Controls
  document.getElementById('btnCloseGroupEditor').addEventListener('click', closeGroupEditorModal);
  document.getElementById('btnCancelGroupEditor').addEventListener('click', closeGroupEditorModal);
  document.getElementById('btnShuffleInModal').addEventListener('click', () => {
    generateGroupsFromSelection(true);
    renderManualGroupsGrid();
  });
  document.getElementById('btnConfirmGroupsStart').addEventListener('click', () => {
    closeGroupEditorModal();
    startTournamentWithCurrentGroups();
  });

  // Perk Picker Modal Controls
  const btnClosePerkPicker = document.getElementById('btnClosePerkPicker');
  if (btnClosePerkPicker) {
    btnClosePerkPicker.addEventListener('click', closePerkPickerModal);
  }
  const searchPerkInput = document.getElementById('searchPerkInput');
  if (searchPerkInput) {
    searchPerkInput.addEventListener('input', renderPerkPickerGrid);
  }
  const filterPerkCat = document.getElementById('filterPerkCategory');
  if (filterPerkCat) {
    filterPerkCat.addEventListener('change', renderPerkPickerGrid);
  }
  const btnClearPerkSlot = document.getElementById('btnClearCurrentPerkSlot');
  if (btnClearPerkSlot) {
    btnClearPerkSlot.addEventListener('click', () => {
      if (!activePerkPickerTarget) return;
      const { side, slotIndex } = activePerkPickerTarget;
      const arr = side === 'A' ? editingPerksA : editingPerksB;
      arr[slotIndex] = null;
      closePerkPickerModal();
      renderModalPerkLoadouts();
    });
  }

  // Item & Addon Picker Modal Controls
  const btnCloseItemAddonPicker = document.getElementById('btnCloseItemAddonPicker');
  if (btnCloseItemAddonPicker) {
    btnCloseItemAddonPicker.addEventListener('click', closeItemAddonPickerModal);
  }
  const searchItemAddonInput = document.getElementById('searchItemAddonInput');
  if (searchItemAddonInput) {
    searchItemAddonInput.addEventListener('input', renderItemAddonPickerGrid);
  }
  const filterItemAddonCategory = document.getElementById('filterItemAddonCategory');
  if (filterItemAddonCategory) {
    filterItemAddonCategory.addEventListener('change', renderItemAddonPickerGrid);
  }
  const btnClearCurrentItemAddonSlot = document.getElementById('btnClearCurrentItemAddonSlot');
  if (btnClearCurrentItemAddonSlot) {
    btnClearCurrentItemAddonSlot.addEventListener('click', () => {
      if (!activeItemAddonPickerTarget) return;
      const { side, targetType, slotIndex } = activeItemAddonPickerTarget;
      if (targetType === 'item') {
        if (side === 'A') {
          editingItemA = null;
          editingAddonsA = [null, null];
        } else {
          editingItemB = null;
          editingAddonsB = [null, null];
        }
      } else {
        if (side === 'A') editingAddonsA[slotIndex] = null;
        else editingAddonsB[slotIndex] = null;
      }
      closeItemAddonPickerModal();
      renderModalItemAddonLoadouts();
    });
  }

  // Backdrop click dismiss for item addon picker
  const itemAddonPickerModalEl = document.getElementById('itemAddonPickerModal');
  if (itemAddonPickerModalEl) {
    itemAddonPickerModalEl.addEventListener('click', e => {
      if (e.target === itemAddonPickerModalEl) closeItemAddonPickerModal();
    });
  }
}

/* ==================== ROLE SWITCHING (KILLER vs SURVIVOR) ==================== */
function switchTournamentRole(newRole) {
  if (currentRole === newRole) return;
  currentRole = newRole;

  document.getElementById('btnRoleKiller').classList.toggle('active', currentRole === 'killer');
  document.getElementById('btnRoleSurvivor').classList.toggle('active', currentRole === 'survivor');
  document.body.classList.toggle('survivor-theme', currentRole === 'survivor');

  applyHeaderWikiLogo();
  saveAllState();
  renderAll();
  fetchWikiAssets();
}

function updateScoringModeDropdown() {
  const selScoring = document.getElementById('selectScoringMode');
  const modes = SCORING_MODES[currentRole];
  const curVal = getCurrentConfig().scoringMode;

  selScoring.innerHTML = modes.map(m =>
    `<option value="${m.id}" ${m.id === curVal ? 'selected' : ''}>${escapeHtml(m.label)}</option>`
  ).join('');

  // Fallback if current value not in mode list
  if (!modes.some(m => m.id === curVal)) {
    getCurrentConfig().scoringMode = modes[0].id;
    selScoring.value = modes[0].id;
  }

  updateScoringModeDescription();
}

function updateScoringModeDescription() {
  const modes = SCORING_MODES[currentRole];
  const curVal = getCurrentConfig().scoringMode;
  const found = modes.find(m => m.id === curVal);
  const descEl = document.getElementById('scoringModeDesc');
  if (descEl) descEl.textContent = found ? found.desc : '';
}

/* ==================== VIEW NAVIGATION ==================== */
function switchView(viewName) {
  currentActiveView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${viewName}`);
  });
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === viewName);
  });
  saveAllState();
  renderAll();
}

function renderAll() {
  if (typeof applyStaticTranslations === 'function') {
    applyStaticTranslations();
  }
  const tourney = getCurrentTournament();
  const isKiller = currentRole === 'killer';

  // Dynamic Theme & Text updates
  document.body.classList.toggle('survivor-theme', !isKiller);
  document.getElementById('btnRoleKiller').classList.toggle('active', isKiller);
  document.getElementById('btnRoleSurvivor').classList.toggle('active', !isKiller);

  // Headers & Labels
  document.getElementById('brandMainTitle').textContent = isKiller ? t('brandTitleKiller') : t('brandTitleSurvivor');
  document.getElementById('brandSubTitle').textContent = t('brandSubtitle');
  document.getElementById('navSetupLabel').textContent = isKiller ? t('tabSetupKiller') : t('tabSetupSurvivor');
  document.getElementById('setupCardTitle').textContent = isKiller ? t('killerModeTitle') : t('survivorModeTitle');
  document.getElementById('setupCardSub').textContent = isKiller ? t('killerModeDesc') : t('survivorModeDesc');

  document.getElementById('rosterHeaderTitle').innerHTML = isKiller
    ? `${t('charSelectKiller')} (<span id="selectedCountHeader">${getCurrentSelectedIds().length}</span> / <span id="totalCountHeader">${getCurrentRoster().length}</span>)`
    : `${t('charSelectSurvivor')} (<span id="selectedCountHeader">${getCurrentSelectedIds().length}</span> / <span id="totalCountHeader">${getCurrentRoster().length}</span>)`;

  document.getElementById('rosterHeaderSub').innerHTML = isKiller
    ? t('charSelectSubtitleKiller')
    : t('charSelectSubtitleSurvivor');

  document.getElementById('optFilterLegacy').textContent = isKiller
    ? "Legacy (Shape & Cenobite)"
    : "Legacy (Laurie Strode)";

  document.getElementById('customCharLabel').textContent = isKiller
    ? t('btnAddCustom')
    : t('btnAddCustom');

  document.getElementById('previewSelectedLabel').textContent = isKiller ? t('charSelectKiller') : t('charSelectSurvivor');
  const roleText = isKiller ? t('roleKiller') : t('roleSurvivor');
  const sidebarDesc = document.getElementById('playerSidebarDesc');
  if (sidebarDesc) {
    sidebarDesc.innerHTML = escapeHtml(t('playerSidebarDesc')).replace('{role}', `<strong id="playerSidebarRoleLabel">${escapeHtml(roleText)}</strong>`);
  } else {
    const roleLbl = document.getElementById('playerSidebarRoleLabel');
    if (roleLbl) roleLbl.textContent = roleText;
  }
  document.getElementById('groupStageMainTitle').textContent = isKiller ? `🌍 ${t('roleKiller')} ${t('groupsTitle')}` : `🌍 ${t('roleSurvivor')} ${t('groupsTitle')}`;
  document.getElementById('bracketMainTitle').textContent = isKiller ? `🏆 ${t('roleKiller')} ${t('bracketTitle')}` : `🏆 ${t('roleSurvivor')} ${t('bracketTitle')}`;
  document.getElementById('championRoleLabel').textContent = isKiller ? t('champRoleKiller') : t('champRoleSurvivor');
  const subTitleEl = document.getElementById('groupStageSubtitle');
  if (subTitleEl) subTitleEl.textContent = t('groupStageDesc');
  const bracketSubEl = document.getElementById('bracketSubtitle');
  if (bracketSubEl) bracketSubEl.textContent = t('bracketDesc');

  const btnRedraw = document.getElementById('btnRedrawGroups');
  if (btnRedraw) {
    btnRedraw.textContent = t('btnRedraw');
    btnRedraw.title = t('titleRedrawGroups');
  }
  const btnSimAll = document.getElementById('btnSimAllGroups');
  if (btnSimAll) {
    btnSimAll.textContent = t('btnSimOpenGroups');
    btnSimAll.title = t('titleSimOpenGroups');
  }
  const btnAdvKO = document.getElementById('btnAdvanceToKO');
  if (btnAdvKO) {
    btnAdvKO.textContent = t('btnAdvanceToKO');
  }
  const btnSimCurRound = document.getElementById('btnSimCurrentRound');
  if (btnSimCurRound) {
    btnSimCurRound.textContent = t('btnSimCurrentRound');
  }
  const btnRegenKO = document.getElementById('btnRegenerateKO');
  if (btnRegenKO) {
    btnRegenKO.textContent = t('btnRegenerateKO');
    btnRegenKO.title = t('titleRegenerateKO');
  }
  document.getElementById('thCharName').textContent = isKiller ? "Killer" : "Survivor";
  document.getElementById('charLeaderboardTitle').textContent = isKiller ? t('charLeaderboardKiller') : t('charLeaderboardSurvivor');

  updateConfigDropdownsText();

  // Table header column names based on scoring mode
  updateStatsTableHeaders();

  // Navigation tabs enable/disable
  document.getElementById('tabGroups').disabled = !tourney.tournamentStarted;
  document.getElementById('tabBracket').disabled = !tourney.tournamentStarted;
  document.getElementById('tabStats').disabled = !tourney.tournamentStarted;

  const activePlayers = getActivePlayers();
  document.getElementById('navPlayerCount').textContent = activePlayers.length;

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${currentActiveView}`);
  });
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === currentActiveView);
  });

  // Config Selects
  const selGroupSize = document.getElementById('selectGroupSize');
  const selAdvance = document.getElementById('selectAdvanceCount');
  const selPerkMode = document.getElementById('selectPerkMode');
  const selItemAddonMode = document.getElementById('selectItemAddonMode');
  const selItemPoolMode = document.getElementById('selectItemPoolMode');
  const selThird = document.getElementById('selectThirdPlace');

  selGroupSize.value = String(tourney.config.groupSize);
  selAdvance.value = tourney.config.advanceMode;
  if (selPerkMode) {
    selPerkMode.value = tourney.config.perkMode || 'random';
  }
  if (selItemAddonMode) {
    selItemAddonMode.value = tourney.config.itemAddonMode || 'random';
  }
  if (selItemPoolMode) {
    selItemPoolMode.value = tourney.config.itemPoolMode || 'basis';
  }
  selThird.value = tourney.config.thirdPlaceMatch ? 'yes' : 'no';

  updateScoringModeDropdown();
  updatePerkModeDescription();
  updateItemAddonModeDescription();
  updateItemPoolModeDescription();
  applyHeaderWikiLogo();

  renderCharacterGrid();
  renderSetupPreview();
  renderPlayersView();

  if (tourney.tournamentStarted) {
    ensureAllMatchesHavePerks(currentRole);
    renderGroupStage();
    renderBracketView();
    renderStatsView();
  }
}

function updateConfigDropdownsText() {
  const selAdvance = document.getElementById('selectAdvanceCount');
  if (selAdvance) {
    const optTop2 = selAdvance.querySelector('option[value="top2"]');
    const optTop1 = selAdvance.querySelector('option[value="top1"]');
    if (optTop2) optTop2.textContent = t('top2');
    if (optTop1) optTop1.textContent = t('top1');
  }

  const selThird = document.getElementById('selectThirdPlace');
  if (selThird) {
    const optYes = selThird.querySelector('option[value="yes"]');
    const optNo = selThird.querySelector('option[value="no"]');
    if (optYes) optYes.textContent = t('yesThirdPlace');
    if (optNo) optNo.textContent = t('noThirdPlace');
  }

  const selPerkMode = document.getElementById('selectPerkMode');
  if (selPerkMode) {
    const optRand = selPerkMode.querySelector('option[value="random"]');
    const optAdept = selPerkMode.querySelector('option[value="adept"]');
    const optCustom = selPerkMode.querySelector('option[value="custom"]');
    const optPerkless = selPerkMode.querySelector('option[value="perkless"]');
    if (optRand) optRand.textContent = t('perkMode_random_label');
    if (optAdept) optAdept.textContent = t('perkMode_adept_label');
    if (optCustom) optCustom.textContent = t('perkMode_custom_label');
    if (optPerkless) optPerkless.textContent = t('perkMode_perkless_label');
  }

  const selItemAddonMode = document.getElementById('selectItemAddonMode');
  if (selItemAddonMode) {
    const optRand = selItemAddonMode.querySelector('option[value="random"]');
    const optCustom = selItemAddonMode.querySelector('option[value="custom"]');
    const optNone = selItemAddonMode.querySelector('option[value="none"]');
    if (optRand) optRand.textContent = t('itemAddonMode_random_label');
    if (optCustom) optCustom.textContent = t('itemAddonMode_custom_label');
    if (optNone) optNone.textContent = t('itemAddonMode_none_label');
  }

  const selItemPoolMode = document.getElementById('selectItemPoolMode');
  if (selItemPoolMode) {
    const optBasis = selItemPoolMode.querySelector('option[value="basis"]');
    const optEvents = selItemPoolMode.querySelector('option[value="events"]');
    if (optBasis) optBasis.textContent = t('itemPoolMode_basis_label');
    if (optEvents) optEvents.textContent = t('itemPoolMode_events_label');
  }

  const selCat = document.getElementById('filterCategory');
  if (selCat) {
    const optAll = selCat.querySelector('option[value="all"]');
    const optOrig = selCat.querySelector('option[value="original"]');
    const optLic = selCat.querySelector('option[value="licensed"]');
    const optSel = selCat.querySelector('option[value="selected"]');
    const optUnsel = selCat.querySelector('option[value="unselected"]');
    if (optAll) optAll.textContent = t('catAll');
    if (optOrig) optOrig.textContent = t('catBase');
    if (optLic) optLic.textContent = t('catLicensed');
    if (optSel) optSel.textContent = t('catOwned');
  }
}

function updateStatsTableHeaders() {
  const mode = getCurrentConfig().scoringMode;
  const isKiller = currentRole === 'killer';

  const thP1 = document.getElementById('thPlayerStat1');
  const thP2 = document.getElementById('thPlayerStat2');
  const thPA1 = document.getElementById('thPlayerAvg1');
  const thPA2 = document.getElementById('thPlayerAvg2');

  const thC1 = document.getElementById('thCharStat1');
  const thC2 = document.getElementById('thCharStat2');
  const thCA1 = document.getElementById('thCharAvg1');

  if (isKiller) {
    thP1.textContent = t('statKills');
    thP2.textContent = t('statHooks');
    thPA1.textContent = `${t('avgKills')} / Match`;
    thPA2.textContent = `${t('avgHooks')} / Match`;
    thC1.textContent = `💀 ${t('statKills')} (Diff)`;
    thC2.textContent = `🪝 ${t('statHooks')} (Diff)`;
    thCA1.textContent = t('avgKills');
  } else {
    if (mode === 'bloodpoints') {
      thP1.textContent = t('statBloodpoints');
      thP2.textContent = t('avgBloodpoints');
      thPA1.textContent = 'Top Score';
      thPA2.textContent = 'Status';
      thC1.textContent = `🩸 ${t('statBloodpoints')}`;
      thC2.textContent = 'BP-Diff';
      thCA1.textContent = t('avgBloodpoints');
    } else if (mode === 'survival_time') {
      thP1.textContent = t('statSurvivalTime');
      thP2.textContent = t('avgSurvivalTime');
      thPA1.textContent = 'Max Zeit';
      thPA2.textContent = 'Status';
      thC1.textContent = `⏱️ ${t('statSurvivalTime')}`;
      thC2.textContent = 'Zeit-Diff';
      thCA1.textContent = t('avgSurvivalTime');
    } else {
      thP1.textContent = t('statEscapes');
      thP2.textContent = t('statGens');
      thPA1.textContent = `${t('avgEscapes')} / Match`;
      thPA2.textContent = `${t('avgGens')} / Match`;
      thC1.textContent = `🚪 ${t('statEscapes')} (Diff)`;
      thC2.textContent = `⚙️ ${t('statGens')} (Diff)`;
      thCA1.textContent = t('avgEscapes');
    }
  }
}

/* ==================== SETUP & CHARACTER SELECTION ==================== */
function applyPreset(preset) {
  const roster = getCurrentRoster();
  const tourney = getCurrentTournament();

  if (preset === 'all') {
    tourney.selectedIds = roster.map(c => c.id);
  } else if (preset === 'none') {
    tourney.selectedIds = [];
  } else if (preset === 'original') {
    tourney.selectedIds = roster.filter(c => !c.licensed).map(c => c.id);
  } else if (preset === 'licensed') {
    tourney.selectedIds = roster.filter(c => c.licensed).map(c => c.id);
  } else if (preset === 'legacy') {
    tourney.selectedIds = roster.filter(c => c.legacy).map(c => c.id);
  } else if (preset === 'no_legacy') {
    tourney.selectedIds = roster.filter(c => !c.legacy).map(c => c.id);
  } else if (preset === 'playable') {
    const activePlayers = getActivePlayers();
    const ownedUnion = new Set(activePlayers.flatMap(p => getPlayerOwnedIds(p, currentRole)));
    tourney.selectedIds = roster.filter(c => ownedUnion.has(c.id)).map(c => c.id);
  } else {
    const count = parseInt(preset, 10);
    if (!isNaN(count)) {
      const shuffled = shuffleArray([...roster]);
      tourney.selectedIds = shuffled.slice(0, count).map(c => c.id);
    }
  }
  saveAllState();
  renderCharacterGrid();
  renderSetupPreview();
}

function addCustomCharacter() {
  const titleEl = document.getElementById('customKillerTitle');
  const nameEl = document.getElementById('customKillerName');
  const title = titleEl.value.trim();
  const name = nameEl.value.trim() || (currentRole === 'killer' ? 'Custom Killer' : 'Custom Survivor');

  if (!title) {
    alert(t('alertEnterCustomName'));
    return;
  }

  const newId = 'custom_' + Date.now();
  const newChar = {
    id: newId,
    title,
    name,
    chapter: 'Custom',
    licensed: true,
    legacy: false,
    icon: currentRole === 'killer' ? '🩸' : '🔦',
    color: currentRole === 'killer' ? '#d11f2f' : '#0284c7',
    adeptPerks: rollRandomPerksForSide(currentRole, 3),
    wikiFiles: []
  };

  const tourney = getCurrentTournament();
  tourney.characters.push(newChar);
  tourney.selectedIds.push(newId);

  // Add to all players' owned list
  sharedPlayers.forEach(p => {
    const list = getPlayerOwnedIds(p, currentRole);
    if (!list.includes(newId)) list.push(newId);
  });

  titleEl.value = '';
  nameEl.value = '';
  saveAllState();
  renderAll();
}

function deleteCustomCharacter(charId) {
  const tourney = getCurrentTournament();
  const charObj = tourney.characters.find(c => c.id === charId);
  if (!charObj || !charId.startsWith('custom_')) return;

  if (!confirm(t('confirmDeleteCustom'))) {
    return;
  }

  tourney.characters = tourney.characters.filter(c => c.id !== charId);
  tourney.selectedIds = tourney.selectedIds.filter(id => id !== charId);

  sharedPlayers.forEach(p => {
    if (Array.isArray(p.ownedKillerIds)) {
      p.ownedKillerIds = p.ownedKillerIds.filter(id => id !== charId);
    }
    if (Array.isArray(p.ownedSurvivorIds)) {
      p.ownedSurvivorIds = p.ownedSurvivorIds.filter(id => id !== charId);
    }
  });

  saveAllState();
  renderAll();
}

function renderCharacterGrid() {
  const grid = document.getElementById('killerGrid');
  const search = (document.getElementById('searchKiller').value || '').toLowerCase().trim();
  const category = document.getElementById('filterCategory').value;

  const roster = getCurrentRoster();
  const selectedSet = new Set(getCurrentSelectedIds());
  document.getElementById('selectedCountHeader').textContent = selectedSet.size;
  document.getElementById('totalCountHeader').textContent = roster.length;
  document.getElementById('totalKillerCountBadge').textContent = roster.length;

  const activePlayers = getActivePlayers();

  const filtered = roster.filter(c => {
    const isSel = selectedSet.has(c.id);
    if (category === 'original' && c.licensed) return false;
    if (category === 'licensed' && !c.licensed) return false;
    if (category === 'legacy' && !c.legacy) return false;
    if (category === 'exclude_legacy' && c.legacy) return false;
    if (category === 'selected' && !isSel) return false;
    if (category === 'unselected' && isSel) return false;

    if (search) {
      const hay = `${c.title} ${c.name} ${c.chapter}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  grid.innerHTML = filtered.map(c => {
    const isSel = selectedSet.has(c.id);
    const isCustom = c.id.startsWith('custom_');
    const owners = activePlayers.filter(p => getPlayerOwnedIds(p, currentRole).includes(c.id));
    const ownerDotsHtml = owners.map(p =>
      `<span class="owner-dot" style="background:${p.color}" title="${escapeHtml(t('playerProfileOf'))}: ${escapeHtml(p.name)} (P${getPlayerPrestige(p, c.id, currentRole)})"></span>`
    ).join('');

    return `
      <div class="killer-card ${isSel ? 'selected' : ''}" data-char-id="${c.id}">
        ${renderCharacterAvatarHtml(c, 'killer-avatar')}
        <div class="killer-info">
          <div class="killer-title" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</div>
          <div class="killer-realname" title="${escapeHtml(c.name)}">${escapeHtml(c.name)}</div>
          <div class="killer-tags">
            <span class="badge-tag ${c.licensed ? 'badge-licensed' : 'badge-original'}">
              ${isCustom ? 'Custom' : (c.licensed ? escapeHtml(t('catLicensed')) : escapeHtml(t('catBase')))}
            </span>
            ${c.legacy ? `<span class="badge-tag badge-legacy" title="${escapeHtml(t('legacyBadgeTitle'))}">Legacy</span>` : ''}
            <span class="owner-dots">${ownerDotsHtml}</span>
            ${isCustom ? `<button type="button" class="btn-delete-custom-char" data-delete-char="${c.id}" title="${escapeHtml(t('deleteCustomCharTitle'))}">🗑️ ${escapeHtml(t('btnDeleteProfile', 'Löschen'))}</button>` : ''}
          </div>
        </div>
        <div class="check-indicator">${isSel ? '✓' : ''}</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-delete-custom-char').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteCustomCharacter(btn.dataset.deleteChar);
    });
  });

  grid.querySelectorAll('.killer-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.charId;
      const selIds = getCurrentTournament().selectedIds;
      const idx = selIds.indexOf(id);
      if (idx >= 0) {
        selIds.splice(idx, 1);
      } else {
        selIds.push(id);
      }
      saveAllState();
      renderCharacterGrid();
      renderSetupPreview();
    });
  });
}

function getTournamentPlanMetrics() {
  const N = getCurrentSelectedIds().length;
  const targetSize = getCurrentConfig().groupSize || 4;
  const numGroups = Math.max(1, Math.round(N / targetSize));

  let koTarget = 8;
  const mode = getCurrentConfig().advanceMode;
  if (mode === 'bracket16') koTarget = 16;
  else if (mode === 'bracket8') koTarget = 8;
  else if (mode === 'bracket4') koTarget = 4;
  else if (mode === 'top1') {
    koTarget = nextPowerOfTwo(numGroups);
  } else {
    koTarget = nextPowerOfTwo(numGroups * 2);
  }

  koTarget = Math.min(32, Math.max(2, koTarget));
  while (koTarget > N && koTarget > 2) {
    koTarget = koTarget / 2;
  }

  return { N, numGroups, koTarget };
}

function nextPowerOfTwo(v) {
  let p = 2;
  while (p < v) p *= 2;
  return p;
}

function renderSetupPreview() {
  const { N, numGroups, koTarget } = getTournamentPlanMetrics();
  document.getElementById('previewSelectedCount').textContent = N;
  document.getElementById('previewGroupCount').textContent = N >= 4 ? numGroups : 0;
  document.getElementById('previewKoCount').textContent = N >= 4 ? koTarget : 0;

  const activePlayers = getActivePlayers();
  const ownedUnion = new Set(activePlayers.flatMap(p => getPlayerOwnedIds(p, currentRole)));
  const unownedSelected = getCurrentSelectedIds().filter(id => !ownedUnion.has(id));
  const summaryEl = document.getElementById('setupPlayerSummaryText');

  const roleLabel = currentRole === 'killer' ? 'Killer' : 'Survivor';

  if (unownedSelected.length > 0) {
    const warnTpl = t('warnUnownedSelected');
    const msg = warnTpl
      .replace('{count}', unownedSelected.length)
      .replace('{role}', roleLabel)
      .replace('{players}', activePlayers.length);
    summaryEl.innerHTML = `<span style="color:#fbbf24">${escapeHtml(msg)}</span>`;
  } else {
    const okTpl = t('infoAllSelectedOwned');
    const names = activePlayers.map(p => p.name).join(', ');
    const msg = okTpl
      .replace('{players}', activePlayers.length)
      .replace('{names}', escapeHtml(names))
      .replace('{count}', N)
      .replace('{role}', roleLabel);
    summaryEl.textContent = msg;
  }

  const hintEl = document.getElementById('previewHintText');
  if (N < 4) {
    hintEl.textContent = t('hintMin4Required').replace('{role}', roleLabel);
    return;
  }

  const baseSize = Math.floor(N / numGroups);
  const remainder = N % numGroups;
  const distText = remainder === 0
    ? t('groupsDistEven').replace('{groups}', numGroups).replace('{size}', baseSize).replace('{role}', roleLabel)
    : t('groupsDistUneven').replace('{rem}', remainder).replace('{sizePlus}', baseSize + 1).replace('{rest}', numGroups - remainder).replace('{size}', baseSize).replace('{role}', roleLabel);

  const directPerGroup = Math.floor(koTarget / numGroups);
  const wildcards = koTarget % numGroups;

  let qualDesc = '';
  if (directPerGroup >= 1 && wildcards === 0) {
    qualDesc = t('qualDirectOnly').replace('{top}', directPerGroup).replace('{ko}', koTarget);
  } else if (directPerGroup >= 1 && wildcards > 0) {
    qualDesc = t('qualWithWildcards').replace('{top}', directPerGroup).replace('{wild}', wildcards).replace('{ko}', koTarget);
  } else {
    qualDesc = t('qualTopWinners').replace('{ko}', koTarget);
  }

  hintEl.textContent = `${t('tournamentModePrefix')}: ${distText}. ${qualDesc}`;
}

/* ==================== PLAYER PROFILES & OWNERSHIP VIEW ==================== */
function addNewPlayerProfile() {
  if (sharedPlayers.length >= 6) {
    alert(t('alertMaxPlayers'));
    return;
  }
  const idx = sharedPlayers.length + 1;
  const newId = 'p_' + Date.now();
  const color = PLAYER_COLORS[(idx - 1) % PLAYER_COLORS.length];
  const defaultKillerPrestige = {};
  DEFAULT_KILLERS.forEach(k => { defaultKillerPrestige[k.id] = 3; });
  const defaultSurvivorPrestige = {};
  DEFAULT_SURVIVORS.forEach(s => { defaultSurvivorPrestige[s.id] = 3; });

  const newPlayer = {
    id: newId,
    name: `Spieler ${idx}`,
    color,
    active: true,
    ownedKillerIds: DEFAULT_KILLERS.map(k => k.id),
    ownedSurvivorIds: DEFAULT_SURVIVORS.map(s => s.id),
    killerPrestige: defaultKillerPrestige,
    survivorPrestige: defaultSurvivorPrestige,
    unlockedKillerPerks: [],
    unlockedSurvivorPerks: []
  };
  sharedPlayers.push(newPlayer);
  selectedPlayerEditorId = newId;
  saveAllState();
  renderAll();
}

function renderPlayersView() {
  const listEl = document.getElementById('playerListContainer');
  const editorEl = document.getElementById('playerEditorPanel');
  if (!listEl || !editorEl) return;

  const activePlayers = getActivePlayers();
  document.getElementById('activePlayersCount').textContent = activePlayers.length;

  if (!sharedPlayers.some(p => p.id === selectedPlayerEditorId)) {
    selectedPlayerEditorId = sharedPlayers[0]?.id;
  }

  const roleLabel = currentRole === 'killer' ? 'Killer' : 'Survivor';
  const roster = getCurrentRoster();
  const allRolePerks = getRolePerks(currentRole);

  listEl.innerHTML = sharedPlayers.map(p => {
    const isSel = p.id === selectedPlayerEditorId;
    const ownedCount = getPlayerOwnedIds(p, currentRole).length;
    const p1Count = roster.filter(c => getPlayerPrestige(p, c.id, currentRole) >= 1).length;
    const shrineCount = getPlayerShrinePerks(p, currentRole).length;
    return `
      <div class="player-profile-item ${isSel ? 'active' : ''}" data-pid="${p.id}">
        <span class="player-badge-dot" style="background:${p.color}"></span>
        <div class="player-profile-meta">
          <div class="player-profile-name">${escapeHtml(p.name)}</div>
          <div class="player-profile-sub">
            ${p.active !== false ? '✅ ' + escapeHtml(t('active')) : '⏸️ ' + escapeHtml(t('paused'))} • ${ownedCount}/${roster.length} ${roleLabel} • 👑 ${p1Count} P1+ • ⛩️ ${shrineCount} ${escapeHtml(t('shrineCountLabel'))}
          </div>
        </div>
        <span style="font-size:0.8rem; color:var(--text-secondary); margin-left:auto; padding-left:0.5rem; white-space:nowrap;">${escapeHtml(t('edit'))} →</span>
      </div>
    `;
  }).join('');

  listEl.querySelectorAll('.player-profile-item').forEach(item => {
    item.addEventListener('click', () => {
      selectedPlayerEditorId = item.dataset.pid;
      renderPlayersView();
    });
  });

  const currentP = sharedPlayers.find(p => p.id === selectedPlayerEditorId);
  if (!currentP) {
    editorEl.innerHTML = `<p class="text-muted">${escapeHtml(t('playerProfileOf'))}</p>`;
    return;
  }

  const ownedIds = getPlayerOwnedIds(currentP, currentRole);
  const ownedSet = new Set(ownedIds);
  const p1PlusCount = roster.filter(c => getPlayerPrestige(currentP, c.id, currentRole) >= 1).length;
  const shrinePerks = getPlayerShrinePerks(currentP, currentRole);
  const availablePerks = getPlayerAvailablePerks(currentP, null, currentRole);

  editorEl.innerHTML = `
    <div class="player-editor-header">
      <div class="player-name-edit-row">
        <input type="color" id="editPlayerColor" class="color-picker-input" value="${currentP.color}" title="${escapeHtml(t('labelPlayerColor'))}" />
        <div>
          <label class="config-label">${escapeHtml(t('labelPlayerName'))}</label>
          <input type="text" id="editPlayerName" class="input-text" value="${escapeHtml(currentP.name)}" style="width: 220px;" />
        </div>
        <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.85rem; cursor:pointer; margin-left:0.5rem;">
          <input type="checkbox" id="editPlayerActive" ${currentP.active !== false ? 'checked' : ''} />
          <span>${escapeHtml(t('labelActiveStatus'))}</span>
        </label>
      </div>

      <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
        ${sharedPlayers.length > 1 ? `<button type="button" class="btn btn-danger-outline btn-xs" id="btnDeletePlayer">🗑️ ${escapeHtml(t('btnDeleteProfile'))}</button>` : ''}
      </div>
    </div>

    <!-- Sub-Tabs: Charaktere & Prestige vs. Schrein der Geheimnisse -->
    <div class="player-editor-tabs">
      <button type="button" class="editor-sub-tab ${activePlayerEditorTab === 'roster' ? 'active' : ''}" data-editor-tab="roster">
        🩸 ${roleLabel} & ${t('prestigeLabel', 'Prestige')} (${ownedSet.size}/${roster.length})
      </button>
      <button type="button" class="editor-sub-tab ${activePlayerEditorTab === 'shrine' ? 'active' : ''}" data-editor-tab="shrine">
        ${t('tabShrine')} (${shrinePerks.length})
      </button>
    </div>

    <!-- Player Stats Bar -->
    <div class="player-stats-bar">
      <span class="player-stat-pill">🎮 ${t('catOwned')}: <strong>${ownedSet.size}</strong>/${roster.length} ${roleLabel}</span>
      <span class="player-stat-pill">👑 Prestige 1+: <strong>${p1PlusCount}</strong></span>
      <span class="player-stat-pill">⛩️ ${t('badgeShrineBought')}: <strong>${shrinePerks.length}</strong></span>
      <span class="player-stat-pill">🔮 Perks: <strong>${availablePerks.length}</strong>/${allRolePerks.length}</span>
    </div>

    ${activePlayerEditorTab === 'roster' ? renderRosterPrestigeTabHtml(currentP, roleLabel, roster, ownedSet, shrinePerks) : renderShrineTabHtml(currentP, roleLabel, allRolePerks, shrinePerks, availablePerks)}
  `;

  // Bind Common Header Inputs
  document.getElementById('editPlayerName')?.addEventListener('input', e => {
    currentP.name = e.target.value.trim() || 'Spieler';
    saveAllState();
    renderPlayersSidebarOnly();
    renderSetupPreview();
  });

  document.getElementById('editPlayerColor')?.addEventListener('input', e => {
    currentP.color = e.target.value;
    saveAllState();
    renderPlayersSidebarOnly();
    renderCharacterGrid();
  });

  document.getElementById('editPlayerActive')?.addEventListener('change', e => {
    if (!e.target.checked && getActivePlayers().length <= 1) {
      alert(t('alertMin1Player'));
      e.target.checked = true;
      return;
    }
    currentP.active = e.target.checked;
    saveAllState();
    renderAll();
  });

  const delBtn = document.getElementById('btnDeletePlayer');
  if (delBtn) {
    delBtn.addEventListener('click', () => {
      if (confirm(t('confirmDeletePlayer'))) {
        sharedPlayers = sharedPlayers.filter(p => p.id !== currentP.id);
        selectedPlayerEditorId = sharedPlayers[0]?.id;
        assignPlayersToAllMatches(true);
        saveAllState();
        renderAll();
      }
    });
  }

  // Bind Sub-Tabs Switching
  editorEl.querySelectorAll('[data-editor-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activePlayerEditorTab = btn.dataset.editorTab;
      renderPlayersView();
    });
  });

  if (activePlayerEditorTab === 'roster') {
    bindRosterPrestigeTabEvents(currentP, roster, editorEl);
  } else {
    bindShrineTabEvents(currentP, allRolePerks, editorEl);
  }
}

function renderRosterPrestigeTabHtml(currentP, roleLabel, roster, ownedSet, shrinePerks) {
  return `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom: 0.85rem; align-items:center;">
      <span style="font-size:0.75rem; font-weight:700; color:var(--text-secondary);">${escapeHtml(t('quickOwnershipLabel'))}:</span>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerOwnAll">${escapeHtml(t('btnOwnAll'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerOwnNoLegacy">${escapeHtml(t('btnWithoutLegacy'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerOwnOriginal">${escapeHtml(t('catBase'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerOwnNone">${escapeHtml(t('btnOwnNone'))}</button>
      <span style="border-left:1px solid var(--border-subtle); height:16px; margin:0 0.2rem;"></span>
      <span style="font-size:0.75rem; font-weight:700; color:var(--text-secondary);">${escapeHtml(t('prestigeLabel'))}</span>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerAllP3" title="Prestige 3">${escapeHtml(t('btnPlayerAllP3'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerAllP1" title="Prestige 1">${escapeHtml(t('btnPlayerAllP1'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerAllP0" title="Prestige 0">${escapeHtml(t('btnPlayerAllP0'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" id="btnPlayerOwnedToP3" title="Prestige 3">${escapeHtml(t('btnPlayerOwnedToP3'))}</button>
    </div>

    <p class="text-muted" style="margin-bottom: 0.85rem; font-size:0.8rem;">
      ${escapeHtml(t('charOwnershipDesc'))}
    </p>

    <div class="ownership-grid" id="ownershipGrid">
      ${roster.map(c => {
        const isOwned = ownedSet.has(c.id);
        const pLevel = getPlayerPrestige(currentP, c.id, currentRole);
        const adeptFiles = c.adeptPerks || [];
        return `
          <div class="ownership-card ${isOwned ? 'owned' : ''}" data-cid="${c.id}">
            <div class="ownership-card-top" data-toggle-own-top="${c.id}">
              ${renderCharacterAvatarHtml(c, 'mini-avatar')}
              <div class="ownership-char-details">
                <div class="ownership-char-title" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</div>
                <div class="ownership-char-sub">
                  <span>${c.legacy ? 'Legacy' : (c.licensed ? 'Lizenziert' : 'Original')}</span>
                </div>
              </div>
              <button type="button" class="btn-toggle-own ${isOwned ? 'owned' : ''}" data-toggle-own="${c.id}">
                ${isOwned ? '✓ ' + escapeHtml(t('btnOwnedStatus')) : '+ ' + escapeHtml(t('btnOwnedStatus'))}
              </button>
            </div>

            <div class="card-prestige-row">
              <span class="card-prestige-label">👑 Prestige:</span>
              <div class="prestige-btn-group">
                <button type="button" class="prestige-btn ${pLevel === 0 ? 'active p0' : ''}" data-cid="${c.id}" data-set-p="0" title="${escapeHtml(t('prestige0'))}">0</button>
                <button type="button" class="prestige-btn ${pLevel === 1 ? 'active p1' : ''}" data-cid="${c.id}" data-set-p="1" title="${escapeHtml(t('prestigeTooltipP1'))}">1</button>
                <button type="button" class="prestige-btn ${pLevel === 2 ? 'active p2' : ''}" data-cid="${c.id}" data-set-p="2" title="${escapeHtml(t('prestigeTooltipP2'))}">2</button>
                <button type="button" class="prestige-btn ${pLevel === 3 ? 'active p3' : ''}" data-cid="${c.id}" data-set-p="3" title="${escapeHtml(t('prestigeTooltipP3'))}">3</button>
              </div>
            </div>

            <div class="card-adept-perks-row">
              <div class="card-adept-perks-list">
                ${adeptFiles.map(file => {
                  const pInfo = getPerkInfo(file);
                  const isShrine = shrinePerks.includes(file);
                  const isPUnlocked = pLevel >= 1;
                  let tip = `${pInfo.name}\n`;
                  if (isPUnlocked) tip += t('tipPrestigeUnlocked').replace('{level}', pLevel);
                  else if (isShrine) tip += t('tipShrineUnlocked');
                  else tip += t('tipCharOnlyUnlocked').replace('{char}', c.title);

                  const pillClass = isPUnlocked ? 'global-unlocked' : (isShrine ? 'shrine-active' : 'locked');
                  return `
                    <div class="mini-adept-perk-pill ${pillClass}" data-toggle-shrine-perk="${file}" title="${escapeHtml(tip)}">
                      <img src="${escapeHtml(pInfo.path)}" alt="${escapeHtml(pInfo.name)}" class="mini-adept-perk-img" loading="lazy" />
                    </div>
                  `;
                }).join('')}
              </div>
              <span class="mini-adept-status-text">
                ${pLevel >= 1 ? `👑 P${pLevel} (global)` : (adeptFiles.some(f => shrinePerks.includes(f)) ? escapeHtml(t('badgePartialShrine')) : escapeHtml(t('badgeOwnOnly')))}
              </span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function bindRosterPrestigeTabEvents(currentP, roster, editorEl) {
  // Preset Buttons
  document.getElementById('btnPlayerOwnAll')?.addEventListener('click', () => {
    const list = getPlayerOwnedIds(currentP, currentRole);
    list.length = 0;
    roster.forEach(c => list.push(c.id));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerOwnNoLegacy')?.addEventListener('click', () => {
    const list = getPlayerOwnedIds(currentP, currentRole);
    list.length = 0;
    roster.filter(c => !c.legacy).forEach(c => list.push(c.id));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerOwnOriginal')?.addEventListener('click', () => {
    const list = getPlayerOwnedIds(currentP, currentRole);
    list.length = 0;
    roster.filter(c => !c.licensed).forEach(c => list.push(c.id));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerOwnNone')?.addEventListener('click', () => {
    const list = getPlayerOwnedIds(currentP, currentRole);
    list.length = 0;
    roster.forEach(c => setPlayerPrestige(currentP, c.id, 0, currentRole));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerAllP3')?.addEventListener('click', () => {
    roster.forEach(c => setPlayerPrestige(currentP, c.id, 3, currentRole));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerAllP1')?.addEventListener('click', () => {
    roster.forEach(c => setPlayerPrestige(currentP, c.id, 1, currentRole));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerAllP0')?.addEventListener('click', () => {
    roster.forEach(c => setPlayerPrestige(currentP, c.id, 0, currentRole));
    saveAllState();
    renderAll();
  });

  document.getElementById('btnPlayerOwnedToP3')?.addEventListener('click', () => {
    const owned = getPlayerOwnedIds(currentP, currentRole);
    owned.forEach(cId => setPlayerPrestige(currentP, cId, 3, currentRole));
    saveAllState();
    renderAll();
  });

  // Prestige level buttons
  editorEl.querySelectorAll('[data-set-p]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const cId = btn.dataset.cid;
      const pLevel = parseInt(btn.dataset.setP, 10);
      setPlayerPrestige(currentP, cId, pLevel, currentRole);
      saveAllState();
      renderPlayersView();
      renderCharacterGrid();
      renderSetupPreview();
    });
  });

  // Ownership toggle buttons
  const toggleOwnership = cId => {
    const list = getPlayerOwnedIds(currentP, currentRole);
    const idx = list.indexOf(cId);
    if (idx >= 0) {
      list.splice(idx, 1);
      setPlayerPrestige(currentP, cId, 0, currentRole);
    } else {
      list.push(cId);
      if (getPlayerPrestige(currentP, cId, currentRole) === 0) {
        setPlayerPrestige(currentP, cId, 3, currentRole);
      }
    }
    saveAllState();
    renderPlayersView();
    renderCharacterGrid();
    renderSetupPreview();
  };

  editorEl.querySelectorAll('[data-toggle-own]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleOwnership(btn.dataset.toggleOwn);
    });
  });

  editorEl.querySelectorAll('[data-toggle-own-top]').forEach(top => {
    top.addEventListener('click', () => {
      toggleOwnership(top.dataset.toggleOwnTop);
    });
  });

  // Mini perk shrine quick-toggle
  editorEl.querySelectorAll('[data-toggle-shrine-perk]').forEach(pill => {
    pill.addEventListener('click', e => {
      e.stopPropagation();
      const perkFile = pill.dataset.toggleShrinePerk;
      togglePlayerShrinePerk(currentP, perkFile, currentRole);
      saveAllState();
      renderPlayersView();
    });
  });
}

function renderShrineTabHtml(currentP, roleLabel, allRolePerks, shrinePerks, availablePerks) {
  return `
    <div class="shrine-info-banner">
      <div class="shrine-info-icon">⛩️</div>
      <div class="shrine-info-text">
        <h4>Schrein der Geheimnisse & Einzel-Perk Freischaltungen</h4>
        <p>
          Hier kannst du gezielt einzelne Perks für <strong>${escapeHtml(currentP.name)}</strong> aktivieren (z. B. im wöchentlichen Schrein der Geheimnisse gekauft), ohne den jeweiligen Charakter auf Prestige 1–3 leveln zu müssen.
          Freigeschaltete Schrein-Perks stehen all deinen Charakteren dieser Rolle für Random Perks und Custom Builds zur Verfügung!
        </p>
      </div>
    </div>

    <div class="shrine-toolbar">
      <input type="text" id="shrineSearchInput" class="input-text" placeholder="🔍 Perk-Name oder Charakter suchen (z. B. Barbecue, Sprint Burst, Nurse)..." value="${escapeHtml(shrineSearchQuery)}" />
      <select id="shrineFilterSelect" class="input-select">
        <option value="all" ${shrineFilterCategory === 'all' ? 'selected' : ''}>Alle Perks (${allRolePerks.length})</option>
        <option value="unlocked" ${shrineFilterCategory === 'unlocked' ? 'selected' : ''}>✅ Nur freigeschaltete Perks (${availablePerks.length})</option>
        <option value="shrine" ${shrineFilterCategory === 'shrine' ? 'selected' : ''}>⛩️ Nur Schrein-Käufe (${shrinePerks.length})</option>
        <option value="prestige" ${shrineFilterCategory === 'prestige' ? 'selected' : ''}>👑 Nur durch Prestige aktiv</option>
        <option value="locked" ${shrineFilterCategory === 'locked' ? 'selected' : ''}>🔒 Nur noch gesperrte Perks</option>
        <option value="general" ${shrineFilterCategory === 'general' ? 'selected' : ''}>⭐ Nur Allgemeine Perks</option>
      </select>
      <button type="button" class="btn btn-secondary btn-sm" id="btnActivateAllShrine">⛩️ Alle Schrein-Perks aktivieren</button>
      <button type="button" class="btn btn-danger-outline btn-sm" id="btnClearShrine">🗑️ Schrein leeren</button>
    </div>

    <div class="shrine-grid" id="shrineGrid">
      ${renderShrineGridHtml(currentP, allRolePerks)}
    </div>
  `;
}

function renderShrineGridHtml(currentP, allRolePerks) {
  const shrinePerks = getPlayerShrinePerks(currentP, currentRole);
  const search = shrineSearchQuery.toLowerCase().trim();

  const filtered = allRolePerks.filter(p => {
    const status = getPlayerPerkUnlockStatus(currentP, p.file, null, currentRole);
    if (shrineFilterCategory === 'unlocked' && !status.unlocked) return false;
    if (shrineFilterCategory === 'shrine' && !shrinePerks.includes(p.file)) return false;
    if (shrineFilterCategory === 'prestige' && status.source !== 'prestige') return false;
    if (shrineFilterCategory === 'locked' && status.unlocked) return false;
    if (shrineFilterCategory === 'general' && !p.isGeneral) return false;

    if (search) {
      const hay = `${p.name} ${p.ownerTitle}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    return `<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding: 2rem;">${escapeHtml(t('noPerksFound'))}</p>`;
  }

  return filtered.map(p => {
    const status = getPlayerPerkUnlockStatus(currentP, p.file, null, currentRole);
    const isShrine = shrinePerks.includes(p.file);

    let statusClass = 'status-locked';
    if (p.isGeneral) statusClass = 'status-general';
    else if (status.source === 'prestige') statusClass = 'status-prestige';
    else if (isShrine) statusClass = 'status-shrine';

    let badgeHtml = '';
    if (p.isGeneral) {
      badgeHtml = `<span class="badge-perk-source source-general">${escapeHtml(t('badgeGeneral'))}</span>`;
    } else if (status.source === 'prestige') {
      badgeHtml = `<span class="badge-perk-source source-prestige">👑 P${status.prestige} (${escapeHtml(p.ownerTitle)})</span>`;
    } else if (isShrine) {
      badgeHtml = `<span class="badge-perk-source source-shrine">⛩️ ${escapeHtml(t('shrineCountLabel'))}</span>`;
    } else {
      badgeHtml = `<span class="badge-perk-source source-locked">${escapeHtml(t('badgeLocked'))}</span>`;
    }

    let actionBtnHtml = '';
    if (p.isGeneral) {
      actionBtnHtml = `<button class="btn-shrine-toggle" disabled title="${escapeHtml(t('badgeAlwaysActive'))}">${escapeHtml(t('badgeAlwaysActive'))}</button>`;
    } else if (status.source === 'prestige') {
      actionBtnHtml = `<button class="btn-shrine-toggle" disabled>👑 P${status.prestige} ${escapeHtml(t('active'))}</button>`;
    } else if (isShrine) {
      actionBtnHtml = `<button class="btn-shrine-toggle active" data-shrine-toggle="${p.file}">${escapeHtml(t('btnInShrine'))}</button>`;
    } else {
      actionBtnHtml = `<button class="btn-shrine-toggle inactive" data-shrine-toggle="${p.file}">${escapeHtml(t('btnBuyInShrine'))}</button>`;
    }

    return `
      <div class="shrine-perk-card ${statusClass}">
        <div class="perk-slot-icon-wrap" style="width:42px; height:42px;">
          <img src="${escapeHtml(p.path)}" alt="${escapeHtml(p.name)}" class="perk-slot-icon" loading="lazy" />
        </div>
        <div class="shrine-perk-meta">
          <div class="shrine-perk-title" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</div>
          <div class="shrine-perk-source">${escapeHtml(p.ownerTitle)}</div>
          ${badgeHtml}
        </div>
        <div>
          ${actionBtnHtml}
        </div>
      </div>
    `;
  }).join('');
}

function bindShrineTabEvents(currentP, allRolePerks, editorEl) {
  const searchInput = document.getElementById('shrineSearchInput');
  const filterSelect = document.getElementById('shrineFilterSelect');

  const updateShrineGridOnly = () => {
    const grid = document.getElementById('shrineGrid');
    if (!grid) return;
    grid.innerHTML = renderShrineGridHtml(currentP, allRolePerks);
    bindShrineGridToggles();
  };

  const bindShrineGridToggles = () => {
    editorEl.querySelectorAll('[data-shrine-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const file = btn.dataset.shrineToggle;
        togglePlayerShrinePerk(currentP, file, currentRole);
        saveAllState();
        renderPlayersView();
      });
    });
  };

  searchInput?.addEventListener('input', e => {
    shrineSearchQuery = e.target.value;
    updateShrineGridOnly();
  });

  filterSelect?.addEventListener('change', e => {
    shrineFilterCategory = e.target.value;
    updateShrineGridOnly();
  });

  document.getElementById('btnActivateAllShrine')?.addEventListener('click', () => {
    const teachables = allRolePerks.filter(p => !p.isGeneral).map(p => p.file);
    const list = getPlayerShrinePerks(currentP, currentRole);
    list.length = 0;
    teachables.forEach(f => list.push(f));
    saveAllState();
    renderPlayersView();
  });

  document.getElementById('btnClearShrine')?.addEventListener('click', () => {
    const list = getPlayerShrinePerks(currentP, currentRole);
    list.length = 0;
    saveAllState();
    renderPlayersView();
  });

  bindShrineGridToggles();
}

function renderPlayersSidebarOnly() {
  const listEl = document.getElementById('playerListContainer');
  if (!listEl) return;
  listEl.querySelectorAll('.player-profile-item').forEach(item => {
    const p = getPlayer(item.dataset.pid);
    if (p) {
      item.querySelector('.player-badge-dot').style.background = p.color;
      item.querySelector('.player-profile-name').textContent = p.name;
    }
  });
}

/* ==================== GROUP GENERATION & ROUND ROBIN ==================== */
function doGroupsMatchSelection() {
  const tourney = getCurrentTournament();
  const inGroups = tourney.groups.flatMap(g => g.killerIds);
  if (inGroups.length !== tourney.selectedIds.length) return false;
  const setA = new Set(inGroups);
  return tourney.selectedIds.every(id => setA.has(id));
}

function generateGroupsFromSelection(shuffle = true) {
  const { numGroups } = getTournamentPlanMetrics();
  const tourney = getCurrentTournament();
  const ids = shuffle ? shuffleArray([...tourney.selectedIds]) : [...tourney.selectedIds];

  const groups = [];
  for (let i = 0; i < numGroups; i++) {
    const letter = getGroupLetter(i);
    groups.push({
      id: letter,
      name: `Gruppe ${letter}`,
      killerIds: [],
      matches: []
    });
  }

  ids.forEach((charId, index) => {
    const gIndex = index % numGroups;
    groups[gIndex].killerIds.push(charId);
  });

  groups.forEach(group => {
    group.matches = buildRoundRobinMatches(group.id, group.killerIds);
  });

  tourney.groups = groups;
  assignPlayersToAllMatches(true);
  saveAllState();
}

function buildRoundRobinMatches(groupId, charIds) {
  const matches = [];
  const poolMode = getCurrentConfig().itemPoolMode || 'basis';
  let matchNum = 1;
  for (let i = 0; i < charIds.length; i++) {
    for (let j = i + 1; j < charIds.length; j++) {
      const rolledA = currentRole === 'survivor'
        ? rollRandomSurvivorItemAndAddons(poolMode)
        : { item: null, addons: rollRandomKillerAddons(charIds[i], 2) };
      const rolledB = currentRole === 'survivor'
        ? rollRandomSurvivorItemAndAddons(poolMode)
        : { item: null, addons: rollRandomKillerAddons(charIds[j], 2) };

      matches.push({
        id: `G_${groupId}_${matchNum++}`,
        groupId,
        killerA: charIds[i],
        killerB: charIds[j],
        playerA: null,
        playerB: null,
        randomPerksA: rollRandomPerksForSide(currentRole, 4),
        randomPerksB: rollRandomPerksForSide(currentRole, 4),
        customPerksA: [null, null, null, null],
        customPerksB: [null, null, null, null],
        randomItemA: rolledA.item,
        randomItemB: rolledB.item,
        randomAddonsA: rolledA.addons,
        randomAddonsB: rolledB.addons,
        customItemA: null,
        customItemB: null,
        customAddonsA: [null, null],
        customAddonsB: [null, null],
        played: false,
        killsA: 0,
        killsB: 0,
        hooksA: 0,
        hooksB: 0,
        note: ''
      });
    }
  }
  return matches;
}

function startTournamentWithCurrentGroups() {
  const tourney = getCurrentTournament();
  tourney.groups.forEach(g => {
    g.matches = buildRoundRobinMatches(g.id, g.killerIds);
  });
  tourney.tournamentStarted = true;
  tourney.activeGroupFilter = 'ALL';
  buildKnockoutBracket();
  assignPlayersToAllMatches(true);
  saveAllState();
  switchView('groups');
}

function getGroupLetter(index) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < 26) return alphabet[index];
  return alphabet[Math.floor(index / 26) - 1] + alphabet[index % 26];
}

/* ==================== MANUAL GROUP EDITOR MODAL ==================== */
function openGroupEditorModal() {
  manualSwapSelection = null;
  renderManualGroupsGrid();
  document.getElementById('groupEditorModal').classList.remove('hidden');
}

function closeGroupEditorModal() {
  document.getElementById('groupEditorModal').classList.add('hidden');
}

function renderManualGroupsGrid() {
  const grid = document.getElementById('manualGroupsGrid');
  const tourney = getCurrentTournament();
  grid.innerHTML = tourney.groups.map((g, gIdx) => `
    <div class="manual-group-box">
      <h4>${escapeHtml(formatGroupName(g))} (${g.killerIds.length})</h4>
      ${g.killerIds.map((cId, sIdx) => {
        const c = getCharacter(cId);
        const isSelected = manualSwapSelection && manualSwapSelection.groupIdx === gIdx && manualSwapSelection.slotIdx === sIdx;
        return `
          <div class="manual-slot ${isSelected ? 'swap-selected' : ''}" data-gidx="${gIdx}" data-sidx="${sIdx}">
            ${renderCharacterAvatarHtml(c, 'mini-avatar')}
            <span style="font-weight:600; color:#fff;">${escapeHtml(c.title)}</span>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');

  grid.querySelectorAll('.manual-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const gIdx = parseInt(slot.dataset.gidx, 10);
      const sIdx = parseInt(slot.dataset.sidx, 10);

      if (!manualSwapSelection) {
        manualSwapSelection = { groupIdx: gIdx, slotIdx: sIdx };
        renderManualGroupsGrid();
      } else {
        const prev = manualSwapSelection;
        const temp = tourney.groups[prev.groupIdx].killerIds[prev.slotIdx];
        tourney.groups[prev.groupIdx].killerIds[prev.slotIdx] = tourney.groups[gIdx].killerIds[sIdx];
        tourney.groups[gIdx].killerIds[sIdx] = temp;
        manualSwapSelection = null;
        saveAllState();
        renderManualGroupsGrid();
      }
    });
  });
}

/* ==================== STANDINGS & QUALIFICATION LOGIC ==================== */
function computeGroupStandings(group) {
  const statsMap = {};
  group.killerIds.forEach(id => {
    statsMap[id] = {
      killerId: id,
      groupId: group.id,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      killsFor: 0,
      killsAgainst: 0,
      killsDiff: 0,
      hooksFor: 0,
      hooksAgainst: 0,
      hooksDiff: 0,
      points: 0
    };
  });

  group.matches.forEach(m => {
    if (!m.played) return;
    const sA = statsMap[m.killerA];
    const sB = statsMap[m.killerB];
    if (!sA || !sB) return;

    sA.played++;
    sB.played++;

    sA.killsFor += m.killsA;
    sA.killsAgainst += m.killsB;
    sB.killsFor += m.killsB;
    sB.killsAgainst += m.killsA;

    sA.hooksFor += m.hooksA;
    sA.hooksAgainst += m.hooksB;
    sB.hooksFor += m.hooksB;
    sB.hooksAgainst += m.hooksA;

    const winner = determineMatchWinnerSide(m, false);
    if (winner === 'A') {
      sA.wins++;
      sA.points += 3;
      sB.losses++;
    } else if (winner === 'B') {
      sB.wins++;
      sB.points += 3;
      sA.losses++;
    } else {
      sA.draws++;
      sB.draws++;
      sA.points += 1;
      sB.points += 1;
    }
  });

  const rows = Object.values(statsMap).map(r => {
    r.killsDiff = r.killsFor - r.killsAgainst;
    r.hooksDiff = r.hooksFor - r.hooksAgainst;
    return r;
  });

  rows.sort(compareStandingRows);
  rows.forEach((r, idx) => { r.rank = idx + 1; });
  return rows;
}

function compareStandingRows(a, b) {
  if (b.points !== a.points) return b.points - a.points;

  const mode = getCurrentConfig().scoringMode;

  if (currentRole === 'killer') {
    if (mode === 'hooks_kills' || mode === 'hooks_only') {
      if (b.hooksDiff !== a.hooksDiff) return b.hooksDiff - a.hooksDiff;
      if (b.hooksFor !== a.hooksFor) return b.hooksFor - a.hooksFor;
      if (b.killsDiff !== a.killsDiff) return b.killsDiff - a.killsDiff;
      if (b.killsFor !== a.killsFor) return b.killsFor - a.killsFor;
    } else {
      if (b.killsDiff !== a.killsDiff) return b.killsDiff - a.killsDiff;
      if (b.killsFor !== a.killsFor) return b.killsFor - a.killsFor;
      if (b.hooksDiff !== a.hooksDiff) return b.hooksDiff - a.hooksDiff;
      if (b.hooksFor !== a.hooksFor) return b.hooksFor - a.hooksFor;
    }
  } else {
    // Survivor Modes:
    // escapes_gens: kills = escape(0/1), hooks = gens(0-5)
    // gens_escapes: kills = escape(0/1), hooks = gens(0-5)
    // bloodpoints / survival_time: kills = points/seconds
    if (mode === 'gens_escapes') {
      if (b.hooksDiff !== a.hooksDiff) return b.hooksDiff - a.hooksDiff;
      if (b.hooksFor !== a.hooksFor) return b.hooksFor - a.hooksFor;
      if (b.killsDiff !== a.killsDiff) return b.killsDiff - a.killsDiff;
      if (b.killsFor !== a.killsFor) return b.killsFor - a.killsFor;
    } else if (mode === 'bloodpoints' || mode === 'survival_time' || mode === 'custom_score') {
      if (b.killsDiff !== a.killsDiff) return b.killsDiff - a.killsDiff;
      if (b.killsFor !== a.killsFor) return b.killsFor - a.killsFor;
    } else {
      // escapes_gens default
      if (b.killsDiff !== a.killsDiff) return b.killsDiff - a.killsDiff;
      if (b.killsFor !== a.killsFor) return b.killsFor - a.killsFor;
      if (b.hooksDiff !== a.hooksDiff) return b.hooksDiff - a.hooksDiff;
      if (b.hooksFor !== a.hooksFor) return b.hooksFor - a.hooksFor;
    }
  }
  return a.killerId.localeCompare(b.killerId);
}

function determineMatchWinnerSide(match, isKnockout = false) {
  const mode = getCurrentConfig().scoringMode;

  if (currentRole === 'killer') {
    if (mode === 'hooks_only') {
      if (match.hooksA > match.hooksB) return 'A';
      if (match.hooksB > match.hooksA) return 'B';
    } else if (mode === 'kills_only' || mode === 'custom_score') {
      if (match.killsA > match.killsB) return 'A';
      if (match.killsB > match.killsA) return 'B';
    } else if (mode === 'hooks_kills') {
      if (match.hooksA > match.hooksB) return 'A';
      if (match.hooksB > match.hooksA) return 'B';
      if (match.killsA > match.killsB) return 'A';
      if (match.killsB > match.killsA) return 'B';
    } else {
      // Default: kills_hooks
      if (match.killsA > match.killsB) return 'A';
      if (match.killsB > match.killsA) return 'B';
      if (match.hooksA > match.hooksB) return 'A';
      if (match.hooksB > match.hooksA) return 'B';
    }
  } else {
    // Survivor Modes:
    if (mode === 'gens_escapes') {
      if (match.hooksA > match.hooksB) return 'A';
      if (match.hooksB > match.hooksA) return 'B';
      if (match.killsA > match.killsB) return 'A';
      if (match.killsB > match.killsA) return 'B';
    } else if (mode === 'bloodpoints' || mode === 'survival_time' || mode === 'custom_score') {
      if (match.killsA > match.killsB) return 'A';
      if (match.killsB > match.killsA) return 'B';
    } else {
      // escapes_gens: kills=escape(0/1), hooks=gens(0-5)
      if (match.killsA > match.killsB) return 'A';
      if (match.killsB > match.killsA) return 'B';
      if (match.hooksA > match.hooksB) return 'A';
      if (match.hooksB > match.hooksA) return 'B';
    }
  }

  if (isKnockout && match.tieWinner) {
    return match.tieWinner;
  }
  return 'DRAW';
}

function getQualifiedKillerSet() {
  const { numGroups, koTarget } = getTournamentPlanMetrics();
  const tourney = getCurrentTournament();
  const allGroupStandings = tourney.groups.map(g => computeGroupStandings(g));

  const directPerGroup = Math.floor(koTarget / numGroups);
  const remainder = koTarget % numGroups;

  const qualifiedIds = new Set();
  const directList = [];
  const wildcardCandidates = [];

  allGroupStandings.forEach(standings => {
    standings.forEach((row, idx) => {
      if (idx < directPerGroup) {
        directList.push(row);
        qualifiedIds.add(row.killerId);
      } else if (idx === directPerGroup) {
        wildcardCandidates.push(row);
      }
    });
  });

  wildcardCandidates.sort(compareStandingRows);
  for (let i = 0; i < remainder && i < wildcardCandidates.length; i++) {
    qualifiedIds.add(wildcardCandidates[i].killerId);
    directList.push(wildcardCandidates[i]);
  }

  return { qualifiedIds, seededRows: directList };
}

/* ==================== RENDER GROUP STAGE ==================== */
function renderPlayerTagHtml(playerId) {
  const p = getPlayer(playerId);
  if (!p) return '';
  return `
    <span class="player-tag-pill" title="Gespielt von ${escapeHtml(p.name)}">
      <span class="player-tag-dot" style="background:${p.color}"></span>
      <span>${escapeHtml(p.name)}</span>
    </span>
  `;
}


function formatGroupName(groupOrName, fallbackId) {
  const gHeading = t('groupHeading');
  if (!groupOrName) return fallbackId ? `${gHeading} ${fallbackId}` : gHeading;
  if (typeof groupOrName === 'object') {
    const letter = groupOrName.id || (groupOrName.name ? String(groupOrName.name).replace(/^(Gruppe|Group|Grupo|Groupe)\s*/i, '') : '');
    return `${gHeading} ${letter}`;
  }
  const clean = String(groupOrName).replace(/^(Gruppe|Group|Grupo|Groupe)\s*/i, '');
  return `${gHeading} ${clean}`;
}

function renderGroupStage() {
  const tourney = getCurrentTournament();
  const allMatches = tourney.groups.flatMap(g => g.matches);
  const playedCount = allMatches.filter(m => m.played).length;
  const totalCount = allMatches.length;
  const pct = totalCount > 0 ? Math.round((playedCount / totalCount) * 100) : 0;

  const lblProgress = document.getElementById('lblGroupMatchesProgress');
  if (lblProgress) {
    lblProgress.innerHTML = `<span data-i18n="groupMatchesPlayedLabel">${escapeHtml(t('groupMatchesPlayedLabel'))}</span> <strong id="groupMatchesPlayed">${playedCount}</strong> / <strong id="groupMatchesTotal">${totalCount}</strong>`;
  } else {
    document.getElementById('groupMatchesPlayed').textContent = playedCount;
    document.getElementById('groupMatchesTotal').textContent = totalCount;
  }
  document.getElementById('groupProgressPercent').textContent = `${pct}%`;
  document.getElementById('groupProgressBar').style.width = `${pct}%`;

  const filterBar = document.getElementById('groupFilterBar');
  filterBar.innerHTML = `
    <button class="group-pill ${tourney.activeGroupFilter === 'ALL' ? 'active' : ''}" data-gfilter="ALL">
      ${t('allGroups')} (${tourney.groups.length})
    </button>
    ${tourney.groups.map(g => `
      <button class="group-pill ${tourney.activeGroupFilter === g.id ? 'active' : ''}" data-gfilter="${g.id}">
        ${escapeHtml(g.name)}
      </button>
    `).join('')}
  `;

  filterBar.querySelectorAll('.group-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      tourney.activeGroupFilter = btn.dataset.gfilter;
      renderGroupStage();
    });
  });

  const { qualifiedIds } = getQualifiedKillerSet();
  const visibleGroups = tourney.activeGroupFilter === 'ALL'
    ? tourney.groups
    : tourney.groups.filter(g => g.id === tourney.activeGroupFilter);

  const isKiller = currentRole === 'killer';
  const mode = getCurrentConfig().scoringMode;

  const col1Label = isKiller ? '💀 Kills' : (mode === 'bloodpoints' ? '🩸 BP' : (mode === 'survival_time' ? '⏱️ Zeit' : (mode === 'gens_escapes' ? '⚙️ Gens' : '🚪 Flucht')));
  const col2Label = isKiller ? '🪝 Hooks' : (mode === 'gens_escapes' ? '🚪 Flucht' : '⚙️ Gens');
  const showCol2 = isKiller || (mode === 'escapes_gens' || mode === 'gens_escapes');

  const container = document.getElementById('groupsContainer');
  container.innerHTML = visibleGroups.map(group => {
    const standings = computeGroupStandings(group);
    const gPlayed = group.matches.filter(m => m.played).length;
    const gTotal = group.matches.length;

    return `
      <div class="group-card">
        <div class="group-card-header">
          <span class="group-name">${escapeHtml(formatGroupName(group))}</span>
          <span class="group-status-badge">${gPlayed}/${gTotal} ${t('thMatches')}</span>
        </div>

        <table class="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>${isKiller ? 'Killer' : 'Survivor'}</th>
              <th title="${t('tableMatches')}">${t('thMatches')}</th>
              <th title="${t('tableWins')} / ${t('tableDraws')} / ${t('tableLosses')}">${t('thWins')}-${t('thDraws')}-${t('thLosses')}</th>
              <th>${col1Label}</th>
              ${showCol2 ? `<th>${col2Label}</th>` : ''}
              <th title="${t('tablePoints')}">${t('thPoints')}</th>
            </tr>
          </thead>
          <tbody>
            ${standings.map(row => {
              const c = getCharacter(row.killerId);
              const isQual = qualifiedIds.has(row.killerId);
              const diffSign = row.killsDiff > 0 ? `+${row.killsDiff}` : row.killsDiff;
              const hDiffSign = row.hooksDiff > 0 ? `+${row.hooksDiff}` : row.hooksDiff;
              return `
                <tr class="${isQual ? 'qualified-row' : ''}">
                  <td><span class="rank-num">${row.rank}</span></td>
                  <td>
                    <div class="table-killer-cell">
                      ${renderCharacterAvatarHtml(c, 'mini-avatar')}
                      <span class="table-killer-name">${escapeHtml(c.title)}</span>
                    </div>
                  </td>
                  <td>${row.played}</td>
                  <td>${row.wins}-${row.draws}-${row.losses}</td>
                  <td>${row.killsFor}:${row.killsAgainst} <small style="color:var(--text-secondary)">(${diffSign})</small></td>
                  ${showCol2 ? `<td>${row.hooksFor}:${row.hooksAgainst} <small style="color:var(--text-secondary)">(${hDiffSign})</small></td>` : ''}
                  <td class="pts-cell">${row.points}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="group-matches">
          <div class="group-matches-title">
            <span>${escapeHtml(t('groupEncountersTitle'))}</span>
            <span>${escapeHtml(t('thResult'))}</span>
          </div>
          ${group.matches.map(m => renderGroupMatchRow(m)).join('')}
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.match-row').forEach(row => {
    row.addEventListener('click', () => {
      openMatchModal({
        type: 'group',
        groupId: row.dataset.groupid,
        matchId: row.dataset.matchid
      });
    });
  });
}

function renderGroupMatchRow(m) {
  const kA = getCharacter(m.killerA);
  const kB = getCharacter(m.killerB);
  const winner = m.played ? determineMatchWinnerSide(m, false) : null;
  const isKiller = currentRole === 'killer';
  const mode = getCurrentConfig().scoringMode;

  let scoreHtml = `<span class="score-main" style="color:var(--text-muted)">vs</span>`;
  if (m.played) {
    if (isKiller) {
      if (mode === 'hooks_only') {
        scoreHtml = `<span class="score-main">${m.hooksA} : ${m.hooksB} 🪝</span>`;
      } else if (mode === 'kills_only' || mode === 'custom_score') {
        scoreHtml = `<span class="score-main">${m.killsA} : ${m.killsB}</span>`;
      } else if (mode === 'hooks_kills') {
        scoreHtml = `
          <span class="score-main">${m.hooksA} : ${m.hooksB} 🪝</span>
          <span class="score-sub-hooks">(${m.killsA}:${m.killsB} 💀)</span>
        `;
      } else {
        scoreHtml = `
          <span class="score-main">${m.killsA} : ${m.killsB} 💀</span>
          <span class="score-sub-hooks">(${m.hooksA}:${m.hooksB} 🪝)</span>
        `;
      }
    } else {
      if (mode === 'bloodpoints') {
        scoreHtml = `<span class="score-main">${m.killsA.toLocaleString()} : ${m.killsB.toLocaleString()} 🩸</span>`;
      } else if (mode === 'survival_time') {
        scoreHtml = `<span class="score-main">${m.killsA}s : ${m.killsB}s ⏱️</span>`;
      } else if (mode === 'gens_escapes') {
        scoreHtml = `
          <span class="score-main">${m.hooksA} : ${m.hooksB} ⚙️</span>
          <span class="score-sub-hooks">(${m.killsA ? t('statEscaped') : t('statDead')} vs ${m.killsB ? t('statEscaped') : t('statDead')})</span>
        `;
      } else if (mode === 'custom_score') {
        scoreHtml = `<span class="score-main">${m.killsA} : ${m.killsB}</span>`;
      } else {
        // escapes_gens default
        const escA = m.killsA ? t('statEscaped') : t('statDead');
        const escB = m.killsB ? t('statEscaped') : t('statDead');
        scoreHtml = `
          <span class="score-main">${m.killsA} : ${m.killsB}</span>
          <span class="score-sub-hooks">(${m.hooksA}:${m.hooksB} ⚙️ Gens)</span>
        `;
      }
    }
  }

  return `
    <div class="match-row ${m.played ? 'played' : ''}" data-groupid="${m.groupId}" data-matchid="${m.id}">
      <div class="match-side side-a ${winner === 'A' ? 'winner' : ''}">
        <div style="display:flex; flex-direction:column; align-items:flex-end; min-width:0;">
          <span class="side-name">${escapeHtml(kA.title)}</span>
          ${renderPlayerTagHtml(m.playerA)}
          ${renderMiniPerkStripHtml(m, 'A')}
          ${renderMiniItemAddonStripHtml(m, 'A')}
        </div>
        ${renderCharacterAvatarHtml(kA, 'mini-avatar')}
      </div>
      <div class="match-score-pill">
        ${scoreHtml}
      </div>
      <div class="match-side side-b ${winner === 'B' ? 'winner' : ''}">
        ${renderCharacterAvatarHtml(kB, 'mini-avatar')}
        <div style="display:flex; flex-direction:column; align-items:flex-start; min-width:0;">
          <span class="side-name">${escapeHtml(kB.title)}</span>
          ${renderPlayerTagHtml(m.playerB)}
          ${renderMiniPerkStripHtml(m, 'B')}
          ${renderMiniItemAddonStripHtml(m, 'B')}
        </div>
      </div>
    </div>
  `;
}

/* ==================== KNOCKOUT BRACKET GENERATION & PROGRESSION ==================== */
function buildKnockoutBracket() {
  const { koTarget } = getTournamentPlanMetrics();
  const { seededRows } = getQualifiedKillerSet();

  const sortedSeeds = [...seededRows].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return compareStandingRows(a, b);
  });

  const seeds = [];
  for (let i = 0; i < koTarget; i++) {
    if (sortedSeeds[i]) {
      seeds.push({
        killerId: sortedSeeds[i].killerId,
        seedLabel: `${sortedSeeds[i].groupId}${sortedSeeds[i].rank}`
      });
    } else {
      seeds.push({ killerId: null, seedLabel: `Seed #${i + 1}` });
    }
  }

  const firstRoundPairs = [];
  const half = koTarget / 2;
  for (let i = 0; i < half; i++) {
    firstRoundPairs.push([seeds[i], seeds[koTarget - 1 - i]]);
  }

  const rounds = [];
  let currentMatchCount = half;
  let roundIndex = 0;

  while (currentMatchCount >= 1) {
    const rName = getRoundName(currentMatchCount);
    const matches = [];
    for (let m = 0; m < currentMatchCount; m++) {
      if (roundIndex === 0) {
        const [sA, sB] = firstRoundPairs[m];
        const poolMode = getCurrentConfig().itemPoolMode || 'basis';
        const rolledA = currentRole === 'survivor'
          ? rollRandomSurvivorItemAndAddons(poolMode)
          : { item: null, addons: rollRandomKillerAddons(sA.killerId, 2) };
        const rolledB = currentRole === 'survivor'
          ? rollRandomSurvivorItemAndAddons(poolMode)
          : { item: null, addons: rollRandomKillerAddons(sB.killerId, 2) };

        matches.push({
          id: `KO_R0_M${m}`,
          label: `${rName} ${m + 1}`,
          killerA: sA.killerId,
          killerB: sB.killerId,
          playerA: null,
          playerB: null,
          randomPerksA: rollRandomPerksForSide(currentRole, 4),
          randomPerksB: rollRandomPerksForSide(currentRole, 4),
          customPerksA: [null, null, null, null],
          customPerksB: [null, null, null, null],
          randomItemA: rolledA.item,
          randomItemB: rolledB.item,
          randomAddonsA: rolledA.addons,
          randomAddonsB: rolledB.addons,
          customItemA: null,
          customItemB: null,
          customAddonsA: [null, null],
          customAddonsB: [null, null],
          seedA: sA.seedLabel,
          seedB: sB.seedLabel,
          played: false,
          killsA: 0,
          killsB: 0,
          hooksA: 0,
          hooksB: 0,
          tieWinner: null,
          note: ''
        });
      } else {
        matches.push({
          id: `KO_R${roundIndex}_M${m}`,
          label: `${rName} ${currentMatchCount > 1 ? m + 1 : ''}`.trim(),
          killerA: null,
          killerB: null,
          playerA: null,
          playerB: null,
          randomPerksA: rollRandomPerksForSide(currentRole, 4),
          randomPerksB: rollRandomPerksForSide(currentRole, 4),
          customPerksA: [null, null, null, null],
          customPerksB: [null, null, null, null],
          randomItemA: null,
          randomItemB: null,
          randomAddonsA: [null, null],
          randomAddonsB: [null, null],
          customItemA: null,
          customItemB: null,
          customAddonsA: [null, null],
          customAddonsB: [null, null],
          seedA: '',
          seedB: '',
          played: false,
          killsA: 0,
          killsB: 0,
          hooksA: 0,
          hooksB: 0,
          tieWinner: null,
          note: ''
        });
      }
    }
    rounds.push({ name: rName, matches });
    currentMatchCount = Math.floor(currentMatchCount / 2);
    roundIndex++;
  }

  let thirdPlace = null;
  if (getCurrentConfig().thirdPlaceMatch && rounds.length >= 2) {
    thirdPlace = {
      id: 'KO_THIRD_PLACE',
      label: 'Spiel um Platz 3',
      killerA: null,
      killerB: null,
      playerA: null,
      playerB: null,
      randomPerksA: rollRandomPerksForSide(currentRole, 4),
      randomPerksB: rollRandomPerksForSide(currentRole, 4),
      customPerksA: [null, null, null, null],
      customPerksB: [null, null, null, null],
      randomItemA: null,
      randomItemB: null,
      randomAddonsA: [null, null],
      randomAddonsB: [null, null],
      customItemA: null,
      customItemB: null,
      customAddonsA: [null, null],
      customAddonsB: [null, null],
      seedA: 'Verlierer HF 1',
      seedB: 'Verlierer HF 2',
      played: false,
      killsA: 0,
      killsB: 0,
      hooksA: 0,
      hooksB: 0,
      tieWinner: null,
      note: ''
    };
  }

  const tourney = getCurrentTournament();
  tourney.bracket = { rounds, thirdPlace };
  propagateBracketWinners();
  assignPlayersToAllMatches(false);
}

function getRoundName(matchCount) {
  if (matchCount === 16) return t('round32');
  if (matchCount === 8) return t('round16');
  if (matchCount === 4) return t('round8');
  if (matchCount === 2) return t('round4');
  if (matchCount === 1) return t('round2');
  return `${t('roundOther')} (${matchCount})`;
}

function getKoMatchWinnerAndLoser(m) {
  if (!m.played || !m.killerA || !m.killerB) return { winner: null, loser: null, side: null };
  const side = determineMatchWinnerSide(m, true);
  if (side === 'A') return { winner: m.killerA, loser: m.killerB, side: 'A' };
  if (side === 'B') return { winner: m.killerB, loser: m.killerA, side: 'B' };
  return { winner: null, loser: null, side: null };
}

function propagateBracketWinners() {
  const tourney = getCurrentTournament();
  const rounds = tourney.bracket.rounds || [];
  for (let r = 0; r < rounds.length - 1; r++) {
    const currMatches = rounds[r].matches;
    const nextMatches = rounds[r + 1].matches;

    for (let m = 0; m < currMatches.length; m++) {
      const { winner } = getKoMatchWinnerAndLoser(currMatches[m]);
      const targetMatchIdx = Math.floor(m / 2);
      const isSlotA = (m % 2 === 0);
      const targetMatch = nextMatches[targetMatchIdx];

      if (targetMatch) {
        const prevChar = isSlotA ? targetMatch.killerA : targetMatch.killerB;
        if (prevChar !== winner) {
          if (isSlotA) {
            targetMatch.killerA = winner;
            targetMatch.randomPerksA = rollRandomPerksForSide(currentRole, 4);
            targetMatch.customPerksA = [null, null, null, null];
            if (currentRole === 'survivor') {
              const rolled = rollRandomSurvivorItemAndAddons(getCurrentConfig().itemPoolMode || 'basis');
              targetMatch.randomItemA = rolled.item;
              targetMatch.randomAddonsA = rolled.addons;
            } else {
              targetMatch.randomItemA = null;
              targetMatch.randomAddonsA = rollRandomKillerAddons(winner, 2);
            }
            targetMatch.customItemA = null;
            targetMatch.customAddonsA = [null, null];
          } else {
            targetMatch.killerB = winner;
            targetMatch.randomPerksB = rollRandomPerksForSide(currentRole, 4);
            targetMatch.customPerksB = [null, null, null, null];
            if (currentRole === 'survivor') {
              const rolled = rollRandomSurvivorItemAndAddons(getCurrentConfig().itemPoolMode || 'basis');
              targetMatch.randomItemB = rolled.item;
              targetMatch.randomAddonsB = rolled.addons;
            } else {
              targetMatch.randomItemB = null;
              targetMatch.randomAddonsB = rollRandomKillerAddons(winner, 2);
            }
            targetMatch.customItemB = null;
            targetMatch.customAddonsB = [null, null];
          }
          targetMatch.played = false;
          targetMatch.tieWinner = null;
          targetMatch.playerA = null;
          targetMatch.playerB = null;
        }
      }
    }
  }

  if (tourney.bracket.thirdPlace && rounds.length >= 2) {
    const semiRound = rounds[rounds.length - 2];
    if (semiRound && semiRound.matches.length === 2) {
      const res1 = getKoMatchWinnerAndLoser(semiRound.matches[0]);
      const res2 = getKoMatchWinnerAndLoser(semiRound.matches[1]);
      const tp = tourney.bracket.thirdPlace;
      if (tp.killerA !== res1.loser || tp.killerB !== res2.loser) {
        tp.killerA = res1.loser;
        tp.killerB = res2.loser;
        tp.randomPerksA = rollRandomPerksForSide(currentRole, 4);
        tp.randomPerksB = rollRandomPerksForSide(currentRole, 4);
        tp.customPerksA = [null, null, null, null];
        tp.customPerksB = [null, null, null, null];
        if (currentRole === 'survivor') {
          const rolledA = rollRandomSurvivorItemAndAddons(getCurrentConfig().itemPoolMode || 'basis');
          const rolledB = rollRandomSurvivorItemAndAddons(getCurrentConfig().itemPoolMode || 'basis');
          tp.randomItemA = rolledA.item;
          tp.randomAddonsA = rolledA.addons;
          tp.randomItemB = rolledB.item;
          tp.randomAddonsB = rolledB.addons;
        } else {
          tp.randomItemA = null;
          tp.randomItemB = null;
          tp.randomAddonsA = rollRandomKillerAddons(res1.loser, 2);
          tp.randomAddonsB = rollRandomKillerAddons(res2.loser, 2);
        }
        tp.customItemA = null;
        tp.customItemB = null;
        tp.customAddonsA = [null, null];
        tp.customAddonsB = [null, null];
        tp.played = false;
        tp.tieWinner = null;
        tp.playerA = null;
        tp.playerB = null;
      }
    }
  }

  assignPlayersToAllMatches(false);
}

/* ==================== RENDER KNOCKOUT BRACKET ==================== */
function renderBracketView() {
  propagateBracketWinners();
  const wrapper = document.getElementById('bracketWrapper');
  const tourney = getCurrentTournament();
  const rounds = tourney.bracket.rounds || [];

  if (!rounds.length) {
    wrapper.innerHTML = `<p class="text-muted">${escapeHtml(t('noBracketYet'))}</p>`;
    return;
  }

  wrapper.innerHTML = rounds.map((round, rIdx) => {
    const matchCount = round.matches.length;
    const rName = getRoundName(matchCount);
    return `
    <div class="bracket-round">
      <div class="round-header">${escapeHtml(rName)}</div>
      <div class="round-matches">
        ${round.matches.map((m, mIdx) => renderKoMatchCard(m, 'ko', rIdx, rName, mIdx + 1, matchCount)).join('')}
        ${rIdx === rounds.length - 1 && tourney.bracket.thirdPlace ? `
          <div style="margin-top: 2rem;">
            <div class="round-header" style="color:var(--text-secondary)">🥉 ${t('thirdPlaceTitle')}</div>
            ${renderKoMatchCard(tourney.bracket.thirdPlace, 'third', rIdx, t('thirdPlaceTitle'), 1, 1)}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  }).join('');

  wrapper.querySelectorAll('.ko-match-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.kotype;
      const rIdx = parseInt(card.dataset.ridx, 10);
      const matchId = card.dataset.matchid;
      openMatchModal({ type, roundIdx: rIdx, matchId });
    });
  });

  const finalRound = rounds[rounds.length - 1];
  const finalMatch = finalRound ? finalRound.matches[0] : null;
  const banner = document.getElementById('championBanner');

  if (finalMatch) {
    const { winner, loser, side } = getKoMatchWinnerAndLoser(finalMatch);
    if (winner) {
      const champ = getCharacter(winner);
      const runnerUp = getCharacter(loser);
      const winningHuman = getPlayer(side === 'A' ? finalMatch.playerA : finalMatch.playerB);
      const isKiller = currentRole === 'killer';

      document.getElementById('championAvatarWrap').innerHTML = renderCharacterAvatarHtml(champ, 'champion-avatar-wrap');
      document.getElementById('championName').textContent = champ.title;
      const champMsg = winningHuman
        ? t('champControlledBy').replace('{role}', isKiller ? t('roleKiller') : t('roleSurvivor')).replace('{player}', winningHuman.name)
        : t('champUndefeated');
      document.getElementById('championSub').textContent = `${champ.name} (${champ.chapter}) • ${champMsg}`;

      let thirdHtml = '';
      if (tourney.bracket.thirdPlace) {
        const tpRes = getKoMatchWinnerAndLoser(tourney.bracket.thirdPlace);
        if (tpRes.winner) {
          const thirdC = getCharacter(tpRes.winner);
          thirdHtml = `<div class="podium-pill">🥉 ${t('rankThird')}: <strong>${escapeHtml(thirdC.title)}</strong></div>`;
        }
      }

      document.getElementById('podiumBadges').innerHTML = `
        <div class="podium-pill">🥈 ${t('rankSecond')}: <strong>${escapeHtml(runnerUp.title)}</strong></div>
        ${thirdHtml}
      `;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }
}

function renderKoMatchCard(m, koType, rIdx, roundName, matchIndex, matchCount) {
  const kA = m.killerA ? getCharacter(m.killerA) : null;
  const kB = m.killerB ? getCharacter(m.killerB) : null;
  const { side } = getKoMatchWinnerAndLoser(m);

  const scoreA = m.played ? formatKoSlotScore(m.killsA, m.hooksA, side === 'A' && m.tieWinner === 'A') : '-';
  const scoreB = m.played ? formatKoSlotScore(m.killsB, m.hooksB, side === 'B' && m.tieWinner === 'B') : '-';

  return `
    <div class="ko-match-card" data-kotype="${koType}" data-ridx="${rIdx}" data-matchid="${m.id}">
      <div class="ko-match-header">
        <span>${escapeHtml(koType === 'third' ? t('thirdPlaceTitle') : (roundName ? `${roundName} ${matchCount > 1 ? matchIndex : ''}`.trim() : m.label))}</span>
        <span>${m.played ? t('matchFinished') : t('matchOpen')}</span>
      </div>
      <div class="ko-slot ${side === 'A' ? 'winner' : ''} ${!kA ? 'tbd' : ''}">
        <div class="ko-slot-left">
          ${m.seedA ? `<span class="ko-seed">${escapeHtml(m.seedA === 'Verlierer HF 1' ? t('loserHf1') : (m.seedA === 'Verlierer HF 2' ? t('loserHf2') : m.seedA))}</span>` : ''}
          ${kA ? renderCharacterAvatarHtml(kA, 'mini-avatar') : '<span>⏳</span>'}
          <div style="display:flex; flex-direction:column; min-width:0;">
            <span class="side-name">${kA ? escapeHtml(kA.title) : 'TBD'}</span>
            ${kA && m.playerA ? renderPlayerTagHtml(m.playerA) : ''}
            ${kA ? renderMiniPerkStripHtml(m, 'A') : ''}
            ${kA ? renderMiniItemAddonStripHtml(m, 'A') : ''}
          </div>
        </div>
        <div class="ko-score">${scoreA}</div>
      </div>
      <div class="ko-slot ${side === 'B' ? 'winner' : ''} ${!kB ? 'tbd' : ''}">
        <div class="ko-slot-left">
          ${m.seedB ? `<span class="ko-seed">${escapeHtml(m.seedB === 'Verlierer HF 1' ? t('loserHf1') : (m.seedB === 'Verlierer HF 2' ? t('loserHf2') : m.seedB))}</span>` : ''}
          ${kB ? renderCharacterAvatarHtml(kB, 'mini-avatar') : '<span>⏳</span>'}
          <div style="display:flex; flex-direction:column; min-width:0;">
            <span class="side-name">${kB ? escapeHtml(kB.title) : 'TBD'}</span>
            ${kB && m.playerB ? renderPlayerTagHtml(m.playerB) : ''}
            ${kB ? renderMiniPerkStripHtml(m, 'B') : ''}
            ${kB ? renderMiniItemAddonStripHtml(m, 'B') : ''}
          </div>
        </div>
        <div class="ko-score">${scoreB}</div>
      </div>
    </div>
  `;
}

function formatKoSlotScore(stat1, stat2, wonByTiebreaker) {
  const mode = getCurrentConfig().scoringMode;
  const isKiller = currentRole === 'killer';
  const tieBadge = wonByTiebreaker ? `<span title="Tie-Breaker Sieger" style="color:var(--entity-gold)">★</span>` : '';

  if (isKiller) {
    if (mode === 'hooks_only') return `${stat2} 🪝 ${tieBadge}`;
    if (mode === 'kills_only' || mode === 'custom_score') return `${stat1} ${tieBadge}`;
    if (mode === 'hooks_kills') return `${stat2}🪝 <span class="ko-hooks-sub">(${stat1}💀)</span> ${tieBadge}`;
    return `${stat1}💀 <span class="ko-hooks-sub">(${stat2}🪝)</span> ${tieBadge}`;
  } else {
    if (mode === 'bloodpoints') return `${stat1.toLocaleString()} 🩸 ${tieBadge}`;
    if (mode === 'survival_time') return `${stat1}s ⏱️ ${tieBadge}`;
    if (mode === 'gens_escapes') return `${stat2}⚙️ <span class="ko-hooks-sub">(${stat1 ? 'Flucht' : 'Tot'})</span> ${tieBadge}`;
    if (mode === 'custom_score') return `${stat1} ${tieBadge}`;
    return `${stat1 ? '🚪 Flucht' : '💀 Tot'} <span class="ko-hooks-sub">(${stat2}⚙️)</span> ${tieBadge}`;
  }
}

/* ==================== MATCH MODAL LOGIC ==================== */
function findMatchObject(ref) {
  if (!ref) return null;
  const tourney = getCurrentTournament();
  if (ref.type === 'group') {
    const g = tourney.groups.find(x => x.id === ref.groupId);
    return g ? g.matches.find(x => x.id === ref.matchId) : null;
  }
  if (ref.type === 'ko') {
    const r = tourney.bracket.rounds[ref.roundIdx];
    return r ? r.matches.find(x => x.id === ref.matchId) : null;
  }
  if (ref.type === 'third') {
    return tourney.bracket.thirdPlace;
  }
  return null;
}

function getStatMax(statNum) {
  const mode = getCurrentConfig().scoringMode;
  const isKiller = currentRole === 'killer';

  if (isKiller) {
    return statNum === 1 ? 4 : 12;
  } else {
    if (mode === 'escapes_gens') return statNum === 1 ? 1 : 5;
    if (mode === 'gens_escapes') return statNum === 1 ? 1 : 5;
    if (mode === 'bloodpoints') return 999999;
    if (mode === 'survival_time') return 999999;
    return 999999;
  }
}

function openMatchModal(ref) {
  const match = findMatchObject(ref);
  if (!match) return;

  if (!match.killerA || !match.killerB) {
    alert(t('alertKoWaitPrevRound'));
    return;
  }

  editingMatchRef = ref;
  editingTieWinner = match.tieWinner || null;

  ensureMatchPerks(match, currentRole);
  ensureMatchItemAddons(match, currentRole);
  const perkMode = getCurrentConfig().perkMode || 'random';
  if (perkMode === 'random') {
    editingPerksA = [...match.randomPerksA];
    editingPerksB = [...match.randomPerksB];
  } else if (perkMode === 'custom') {
    editingPerksA = [...(match.customPerksA || [null, null, null, null])];
    editingPerksB = [...(match.customPerksB || [null, null, null, null])];
  } else if (perkMode === 'adept') {
    editingPerksA = [...getCharacterAdeptPerks(match.killerA), null].slice(0, 4);
    editingPerksB = [...getCharacterAdeptPerks(match.killerB), null].slice(0, 4);
  } else {
    editingPerksA = [];
    editingPerksB = [];
  }

  const itemAddonMode = getCurrentConfig().itemAddonMode || 'random';
  if (itemAddonMode === 'random') {
    editingItemA = match.randomItemA || null;
    editingItemB = match.randomItemB || null;
    editingAddonsA = [...(match.randomAddonsA || [null, null])];
    editingAddonsB = [...(match.randomAddonsB || [null, null])];
  } else if (itemAddonMode === 'custom') {
    editingItemA = match.customItemA || null;
    editingItemB = match.customItemB || null;
    editingAddonsA = [...(match.customAddonsA || [null, null])];
    editingAddonsB = [...(match.customAddonsB || [null, null])];
  } else {
    editingItemA = null;
    editingItemB = null;
    editingAddonsA = [null, null];
    editingAddonsB = [null, null];
  }

  const kA = getCharacter(match.killerA);
  const kB = getCharacter(match.killerB);
  const isKiller = currentRole === 'killer';

  document.getElementById('modalMatchLabel').textContent =
    ref.type === 'group' ? `${formatGroupName(null, ref.groupId)} • ${t('modalGroupMatch')}` : match.label;

  document.getElementById('modalAvatarA').innerHTML = renderCharacterAvatarHtml(kA, 'competitor-avatar');
  document.getElementById('modalTitleA').textContent = kA.title;
  document.getElementById('modalSubA').textContent = kA.name;

  document.getElementById('modalAvatarB').innerHTML = renderCharacterAvatarHtml(kB, 'competitor-avatar');
  document.getElementById('modalTitleB').textContent = kB.title;
  document.getElementById('modalSubB').textContent = kB.name;

  document.getElementById('modalPlayerLabelA').textContent = `${t('playerFor')} ${escapeHtml(kA.title)}`;
  document.getElementById('modalPlayerLabelB').textContent = `${t('playerFor')} ${escapeHtml(kB.title)}`;

  // Populate Player Selects
  const activePlayers = getActivePlayers();
  const selPA = document.getElementById('selectModalPlayerA');
  const selPB = document.getElementById('selectModalPlayerB');

  const optionsHtml = activePlayers.map(p =>
    `<option value="${p.id}">${escapeHtml(p.name)}</option>`
  ).join('');

  selPA.innerHTML = optionsHtml;
  selPB.innerHTML = optionsHtml;

  if (!match.playerA || !match.playerB) {
    assignPlayersToAllMatches(false);
  }
  selPA.value = match.playerA || activePlayers[0]?.id;
  selPB.value = match.playerB || activePlayers[1]?.id || activePlayers[0]?.id;

  checkModalPlayerOwnershipWarnings();

  document.getElementById('btnTieWinnerA').textContent = `${t('winnerBadge')} ${kA.title}`;
  document.getElementById('btnTieWinnerB').textContent = `${t('winnerBadge')} ${kB.title}`;

  // Configure Quick Score Controls based on active mode
  configureModalControlsForMode();
  renderModalPerkLoadouts();
  renderModalItemAddonLoadouts();

  setModalStat1('A', match.played ? match.killsA : 0);
  setModalStat1('B', match.played ? match.killsB : 0);
  document.getElementById('inputHooksA').value = match.played ? match.hooksA : (isKiller ? (match.killsA * 2 || 0) : (match.killsA ? 3 : 1));
  document.getElementById('inputHooksB').value = match.played ? match.hooksB : (isKiller ? (match.killsB * 2 || 0) : (match.killsB ? 3 : 1));
  document.getElementById('inputMatchNote').value = match.note || '';

  updateModalLiveVerdict();
  document.getElementById('matchModal').classList.remove('hidden');
}

/* ==================== MATCH MODAL PERK LOADOUT & PICKER ==================== */
function renderModalPerkLoadouts() {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  const perkMode = getCurrentConfig().perkMode || 'random';
  ['A', 'B'].forEach(side => {
    const charId = side === 'A' ? match.killerA : match.killerB;
    const charObj = getCharacter(charId);
    const labelEl = document.getElementById(`perkLabel${side}`);
    const actionsEl = document.getElementById(`perkActions${side}`);
    const slotsEl = document.getElementById(`modalPerkSlots${side}`);
    const perksArr = side === 'A' ? editingPerksA : editingPerksB;

    if (!labelEl || !actionsEl || !slotsEl) return;

    if (perkMode === 'perkless') {
      labelEl.textContent = t('perklessModeActive');
      actionsEl.innerHTML = '';
      slotsEl.innerHTML = `
        <div class="perkless-banner" style="grid-column: span 4;">
          ${t('perklessBanner')}
        </div>
      `;
      return;
    }

    if (perkMode === 'adept') {
      labelEl.textContent = `${t('adeptPerksTitle')} (${charObj.title})`;
      actionsEl.innerHTML = '';
      const adeptFiles = getCharacterAdeptPerks(charId);
      const cardsHtml = [0, 1, 2, 3].map(idx => {
        if (idx < 3 && adeptFiles[idx]) {
          const info = getPerkInfo(adeptFiles[idx]);
          return `
            <div class="perk-slot-card" title="${escapeHtml(info.name)} (${t('adeptPerksTitle')} - ${escapeHtml(info.ownerTitle)})">
              <div class="perk-slot-icon-wrap">
                <img src="${escapeHtml(info.path)}" alt="${escapeHtml(info.name)}" class="perk-slot-icon" />
              </div>
              <div class="perk-slot-meta">
                <div class="perk-slot-name">${escapeHtml(info.name)}</div>
                <div class="perk-slot-owner">${t('adeptPerksTitle')}</div>
              </div>
            </div>
          `;
        }
        return `
          <div class="perk-slot-card locked-slot" title="${t('lockedSlot')}">
            <div class="perk-slot-icon-wrap">
              <span class="perk-slot-empty-icon">🔒</span>
            </div>
            <div class="perk-slot-meta">
              <div class="perk-slot-name" style="color:var(--text-muted)">${t('lockedSlot')}</div>
              <div class="perk-slot-owner">${t('only3Perks')}</div>
            </div>
          </div>
        `;
      }).join('');
      slotsEl.innerHTML = cardsHtml;
      return;
    }

    if (perkMode === 'random') {
      labelEl.textContent = t('randomPerksTitle');
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-secondary btn-xs" data-reroll-all="${side}" title="${t('btnRerollAllPerks')}">${t('btnRerollAllPerks')}</button>
      `;
      slotsEl.innerHTML = [0, 1, 2, 3].map(idx => {
        const file = perksArr[idx];
        const info = file ? getPerkInfo(file) : null;
        return `
          <div class="perk-slot-card interactive" data-random-slot="${idx}" data-side="${side}" title="${info ? `${escapeHtml(info.name)} (${escapeHtml(info.ownerTitle)}) — ${escapeHtml(t('clickToRerollPerk'))}` : escapeHtml(t('btnRerollAllAddons'))}">
            <div class="perk-slot-icon-wrap">
              ${info ? `<img src="${escapeHtml(info.path)}" alt="${escapeHtml(info.name)}" class="perk-slot-icon" />` : `<span class="perk-slot-empty-icon">🎲</span>`}
            </div>
            <div class="perk-slot-meta">
              <div class="perk-slot-name">${info ? escapeHtml(info.name) : escapeHtml(t('perkEmpty'))}</div>
              <div class="perk-slot-owner">${info ? (info.isGeneral ? escapeHtml(t('perkGeneralName')) : escapeHtml(t('perkFromOwner').replace('{0}', info.ownerTitle))) : escapeHtml(t('perkClickShort'))}</div>
            </div>
          </div>
        `;
      }).join('');

      actionsEl.querySelectorAll('[data-reroll-all]').forEach(btn => {
        btn.addEventListener('click', () => {
          const pObj = getPlayer(side === 'A' ? match.playerA : match.playerB);
          const newPerks = rollRandomPerksForSide(currentRole, 4, [], pObj, charId);
          if (side === 'A') {
            editingPerksA = newPerks;
            match.randomPerksA = [...newPerks];
          } else {
            editingPerksB = newPerks;
            match.randomPerksB = [...newPerks];
          }
          saveAllState();
          renderModalPerkLoadouts();
        });
      });

      slotsEl.querySelectorAll('[data-random-slot]').forEach(card => {
        card.addEventListener('click', () => {
          const sIdx = parseInt(card.dataset.randomSlot, 10);
          const arr = side === 'A' ? editingPerksA : editingPerksB;
          const pObj = getPlayer(side === 'A' ? match.playerA : match.playerB);
          const replacement = rollRandomPerksForSide(currentRole, 1, arr.filter(Boolean), pObj, charId)[0];
          if (replacement) {
            arr[sIdx] = replacement;
            if (side === 'A') match.randomPerksA = [...arr];
            else match.randomPerksB = [...arr];
            saveAllState();
            renderModalPerkLoadouts();
          }
        });
      });
      return;
    }

    // 'custom' mode: players pick and record their perks
    labelEl.textContent = t('customPerksTitle');
    actionsEl.innerHTML = `
      <button type="button" class="btn btn-secondary btn-xs" data-custom-adept="${side}" title="${escapeHtml(t('perkMode_adept_desc'))}">${escapeHtml(t('btnCustomAdept'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" data-custom-rand="${side}" title="${escapeHtml(t('btnRandom'))}">${escapeHtml(t('btnCustomRandom'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" data-custom-clear="${side}" title="${escapeHtml(t('btnClearSlot'))}">${escapeHtml(t('btnCustomClear'))}</button>
    `;

    slotsEl.innerHTML = [0, 1, 2, 3].map(idx => {
      const file = perksArr[idx];
      const info = file ? getPerkInfo(file) : null;
      return `
        <div class="perk-slot-card interactive" data-custom-slot="${idx}" data-side="${side}" title="${info ? `${escapeHtml(info.name)} (${escapeHtml(info.ownerTitle)}) — ${escapeHtml(t('clickToChangePerk'))}` : escapeHtml(t('clickToSelectPerk'))}">
          <div class="perk-slot-icon-wrap">
            ${info ? `<img src="${escapeHtml(info.path)}" alt="${escapeHtml(info.name)}" class="perk-slot-icon" />` : `<span class="perk-slot-empty-icon">＋</span>`}
          </div>
          <div class="perk-slot-meta">
            <div class="perk-slot-name">${info ? escapeHtml(info.name) : `Perk ${idx + 1}`}</div>
            <div class="perk-slot-owner">${info ? (info.isGeneral ? escapeHtml(t('badgeGeneral')) : escapeHtml(info.ownerTitle)) : escapeHtml(t('chooseSlot'))}</div>
          </div>
        </div>
      `;
    }).join('');

    actionsEl.querySelector(`[data-custom-adept="${side}"]`).addEventListener('click', () => {
      const adept = getCharacterAdeptPerks(charId);
      const next = [adept[0] || null, adept[1] || null, adept[2] || null, null];
      if (side === 'A') editingPerksA = next;
      else editingPerksB = next;
      renderModalPerkLoadouts();
    });

    actionsEl.querySelector(`[data-custom-rand="${side}"]`).addEventListener('click', () => {
      const pObj = getPlayer(side === 'A' ? match.playerA : match.playerB);
      const rand = rollRandomPerksForSide(currentRole, 4, [], pObj, charId);
      if (side === 'A') editingPerksA = rand;
      else editingPerksB = rand;
      renderModalPerkLoadouts();
    });

    actionsEl.querySelector(`[data-custom-clear="${side}"]`).addEventListener('click', () => {
      if (side === 'A') editingPerksA = [null, null, null, null];
      else editingPerksB = [null, null, null, null];
      renderModalPerkLoadouts();
    });

    slotsEl.querySelectorAll('[data-custom-slot]').forEach(card => {
      card.addEventListener('click', () => {
        const sIdx = parseInt(card.dataset.customSlot, 10);
        openPerkPickerModal(side, sIdx);
      });
    });
  });
}

function openPerkPickerModal(side, slotIndex) {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  activePerkPickerTarget = { side, slotIndex };
  const charId = side === 'A' ? match.killerA : match.killerB;
  const charObj = getCharacter(charId);
  const pObj = getPlayer(side === 'A' ? match.playerA : match.playerB);

  const titleEl = document.getElementById('perkPickerTitle');
  if (titleEl) {
    titleEl.textContent = `${t('pickPerkTitle')} • ${charObj.title} (${pObj ? escapeHtml(pObj.name) : t('playerFallback')}) • ${t('slotWord')} ${slotIndex + 1}`;
  }

  const searchInput = document.getElementById('searchPerkInput');
  if (searchInput) searchInput.value = '';

  const filterSelect = document.getElementById('filterPerkCategory');
  if (filterSelect) filterSelect.value = 'unlocked';

  renderPerkPickerGrid();
  document.getElementById('perkPickerModal').classList.remove('hidden');
  if (searchInput) searchInput.focus();
}

function closePerkPickerModal() {
  const modal = document.getElementById('perkPickerModal');
  if (modal) modal.classList.add('hidden');
  activePerkPickerTarget = null;
}

function renderPerkPickerGrid() {
  const grid = document.getElementById('perkPickerGrid');
  if (!grid || !activePerkPickerTarget || !editingMatchRef) return;

  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  const { side, slotIndex } = activePerkPickerTarget;
  const charId = side === 'A' ? match.killerA : match.killerB;
  const pObj = getPlayer(side === 'A' ? match.playerA : match.playerB);
  const currentArr = side === 'A' ? editingPerksA : editingPerksB;
  const activeSlotFile = currentArr[slotIndex];

  const search = (document.getElementById('searchPerkInput')?.value || '').toLowerCase().trim();
  const filterCat = document.getElementById('filterPerkCategory')?.value || 'unlocked';

  const allRolePerks = getRolePerks(currentRole);
  const filtered = allRolePerks.filter(p => {
    const isUnlocked = isPerkUnlockedForPlayer(pObj, p.file, charId, currentRole);
    if (filterCat === 'unlocked' && !isUnlocked) return false;
    if (filterCat === 'char' && p.ownerId !== charId) return false;
    if (filterCat === 'general' && !p.isGeneral) return false;
    if (filterCat === 'shrine' && !getPlayerShrinePerks(pObj, currentRole).includes(p.file)) return false;

    if (search) {
      const hay = `${p.name} ${p.ownerTitle}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding: 1.5rem;">${escapeHtml(t('noPerksFound'))}</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isSelected = p.file === activeSlotFile;
    const isAlreadyEquippedOtherSlot = currentArr.some((f, idx) => idx !== slotIndex && f === p.file);
    const unlockStatus = getPlayerPerkUnlockStatus(pObj, p.file, charId, currentRole);

    let unlockTag = '';
    if (unlockStatus.unlocked) {
      if (p.isGeneral) unlockTag = escapeHtml(t('badgeGeneral'));
      else if (unlockStatus.source === 'own') unlockTag = '🏅 ' + escapeHtml(t('perkOwnTag'));
      else if (unlockStatus.source === 'prestige') unlockTag = `👑 P${unlockStatus.prestige}`;
      else if (unlockStatus.source === 'shrine') unlockTag = escapeHtml(t('tabShrine'));
    } else {
      unlockTag = '🔒 ' + escapeHtml(t('slotLocked'));
    }

    return `
      <div class="perk-picker-item ${isSelected ? 'selected' : ''} ${!unlockStatus.unlocked ? 'locked' : ''}" data-perk-file="${escapeHtml(p.file)}" style="${isAlreadyEquippedOtherSlot ? 'opacity:0.45;' : ''}">
        <div class="perk-slot-icon-wrap">
          <img src="${escapeHtml(p.path)}" alt="${escapeHtml(p.name)}" class="perk-slot-icon" loading="lazy" />
        </div>
        <div class="perk-slot-meta">
          <div class="perk-picker-name">${escapeHtml(p.name)}</div>
          <div class="perk-picker-owner">
            ${escapeHtml(p.ownerTitle)}
            ${isAlreadyEquippedOtherSlot ? ` • (${escapeHtml(t('alreadyEquippedOtherSlot'))})` : ''}
            • <span style="color:${unlockStatus.unlocked ? '#4ade80' : '#f87171'}">${unlockTag}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.perk-picker-item').forEach(item => {
    item.addEventListener('click', () => {
      const chosenFile = item.dataset.perkFile;
      // Avoid duplicate perk in another slot of the same character
      const existingIdx = currentArr.findIndex((f, idx) => idx !== slotIndex && f === chosenFile);
      if (existingIdx >= 0) {
        currentArr[existingIdx] = currentArr[slotIndex] || null;
      }
      currentArr[slotIndex] = chosenFile;
      closePerkPickerModal();
      renderModalPerkLoadouts();
    });
  });
}

/* ==================== MATCH MODAL ITEM & ADDON LOADOUT & PICKER ==================== */
function renderModalItemAddonLoadouts() {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  const itemAddonMode = getCurrentConfig().itemAddonMode || 'random';
  const isKiller = currentRole === 'killer';
  const poolMode = getCurrentConfig().itemPoolMode || 'basis';

  ['A', 'B'].forEach(side => {
    const charId = side === 'A' ? match.killerA : match.killerB;
    const charObj = getCharacter(charId);
    const labelEl = document.getElementById(`itemAddonLabel${side}`);
    const actionsEl = document.getElementById(`itemAddonActions${side}`);
    const slotsEl = document.getElementById(`modalItemAddonSlots${side}`);
    const currentItem = side === 'A' ? editingItemA : editingItemB;
    const currentAddons = side === 'A' ? editingAddonsA : editingAddonsB;

    if (!labelEl || !actionsEl || !slotsEl) return;

    if (itemAddonMode === 'none') {
      labelEl.textContent = '🚫 Ohne Items / Addons';
      actionsEl.innerHTML = '';
      slotsEl.innerHTML = `
        <div class="perkless-banner" style="grid-column: 1 / -1;">
          🚫 <strong>Item- & Addon-freier Modus aktiv</strong> — Keine Gegenstände oder Zusätze in diesem Match.
        </div>
      `;
      return;
    }

    if (isKiller) {
      // KILLER: No item slot, only 2 Addon slots
      labelEl.textContent = t('killerAddonsTitle');

      if (itemAddonMode === 'random') {
        actionsEl.innerHTML = `
          <button type="button" class="btn btn-secondary btn-xs" data-reroll-killer-addons="${side}" title="${escapeHtml(t('rerollSingleAddonTitle'))}">${escapeHtml(t('btnRerollAllAddons'))}</button>
        `;
        slotsEl.innerHTML = [0, 1].map(idx => {
          const addPath = currentAddons[idx];
          const info = addPath ? getAddonInfo(addPath, 'killer', charId) : null;
          return `
            <div class="item-addon-slot-card interactive" data-random-killer-addon-slot="${idx}" data-side="${side}" title="${info ? `${escapeHtml(info.name)} — ${escapeHtml(t('rerollSingleAddonTitle'))}` : escapeHtml(t('clickToRoll'))}">
              <div class="item-addon-slot-icon-wrap">
                ${info ? `<img src="${escapeHtml(info.path)}" alt="${escapeHtml(info.name)}" class="item-addon-slot-icon" />` : `<span class="item-addon-slot-empty-icon">🎲</span>`}
              </div>
              <div class="item-addon-slot-meta">
                <div class="item-addon-slot-name">${info ? escapeHtml(info.name) : 'Addon ' + (idx + 1)}</div>
                <div class="item-addon-slot-sub">${escapeHtml(t('randomAddonSubtitle'))}</div>
              </div>
            </div>
          `;
        }).join('');

        actionsEl.querySelector(`[data-reroll-killer-addons="${side}"]`).addEventListener('click', () => {
          const newAddons = rollRandomKillerAddons(charId, 2);
          if (side === 'A') {
            editingAddonsA = newAddons;
            match.randomAddonsA = [...newAddons];
          } else {
            editingAddonsB = newAddons;
            match.randomAddonsB = [...newAddons];
          }
          saveAllState();
          renderModalItemAddonLoadouts();
        });

        slotsEl.querySelectorAll('[data-random-killer-addon-slot]').forEach(card => {
          card.addEventListener('click', () => {
            const sIdx = parseInt(card.dataset.randomKillerAddonSlot, 10);
            const otherIdx = sIdx === 0 ? 1 : 0;
            const exclude = [currentAddons[otherIdx]].filter(Boolean);
            const rolled = rollRandomKillerAddons(charId, 1, exclude)[0];
            if (rolled) {
              currentAddons[sIdx] = rolled;
              if (side === 'A') match.randomAddonsA = [...currentAddons];
              else match.randomAddonsB = [...currentAddons];
              saveAllState();
              renderModalItemAddonLoadouts();
            }
          });
        });
        return;
      }

      // Custom Mode Killer
      labelEl.textContent = t('killerAddonsCustomTitle');
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-secondary btn-xs" data-custom-killer-rand="${side}" title="${escapeHtml(t('btnRandom'))}">${escapeHtml(t('btnRandom'))}</button>
        <button type="button" class="btn btn-secondary btn-xs" data-custom-killer-clear="${side}" title="${escapeHtml(t('btnClearSlot'))}">🗑️</button>
      `;

      slotsEl.innerHTML = [0, 1].map(idx => {
        const addPath = currentAddons[idx];
        const info = addPath ? getAddonInfo(addPath, 'killer', charId) : null;
        return `
          <div class="item-addon-slot-card interactive" data-custom-killer-addon-slot="${idx}" data-side="${side}" title="${info ? `${escapeHtml(info.name)} — ${escapeHtml(t('clickToChange'))}` : escapeHtml(t('chooseAddonTitle'))}">
            <div class="item-addon-slot-icon-wrap">
              ${info ? `<img src="${escapeHtml(info.path)}" alt="${escapeHtml(info.name)}" class="item-addon-slot-icon" />` : `<span class="item-addon-slot-empty-icon">＋</span>`}
            </div>
            <div class="item-addon-slot-meta">
              <div class="item-addon-slot-name">${info ? escapeHtml(info.name) : 'Addon ' + (idx + 1)}</div>
              <div class="item-addon-slot-sub">${info ? escapeHtml(t('selectedAddonSubtitle')) : escapeHtml(t('chooseSlot'))}</div>
            </div>
          </div>
        `;
      }).join('');

      actionsEl.querySelector(`[data-custom-killer-rand="${side}"]`).addEventListener('click', () => {
        const rand = rollRandomKillerAddons(charId, 2);
        if (side === 'A') editingAddonsA = rand;
        else editingAddonsB = rand;
        renderModalItemAddonLoadouts();
      });

      actionsEl.querySelector(`[data-custom-killer-clear="${side}"]`).addEventListener('click', () => {
        if (side === 'A') editingAddonsA = [null, null];
        else editingAddonsB = [null, null];
        renderModalItemAddonLoadouts();
      });

      slotsEl.querySelectorAll('[data-custom-killer-addon-slot]').forEach(card => {
        card.addEventListener('click', () => {
          const sIdx = parseInt(card.dataset.customKillerAddonSlot, 10);
          openItemAddonPickerModal(side, 'addon', sIdx);
        });
      });
      return;
    }

    // SURVIVOR: 1 Item Slot + 2 Addon Slots
    if (itemAddonMode === 'random') {
      labelEl.textContent = t('survivorItemAddonRandomTitle');
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-secondary btn-xs" data-reroll-survivor-loadout="${side}" title="${escapeHtml(t('btnRerollCompleteLoadout'))}">${escapeHtml(t('btnRerollCompleteLoadout'))}</button>
      `;

      const itemInfo = currentItem ? getItemInfo(currentItem) : null;
      const canHaveAddons = itemInfo && itemInfo.type !== 'firecracker' && itemInfo.type !== 'fogvial';

      let slotsHtml = `
        <div class="item-addon-slot-card interactive" data-random-survivor-item="${side}" title="${itemInfo ? `${escapeHtml(itemInfo.name)} — ${escapeHtml(t('rerollItemTitle'))}` : escapeHtml(t('clickToRoll'))}">
          <div class="item-addon-slot-icon-wrap">
            ${itemInfo ? `<img src="${escapeHtml(itemInfo.path)}" alt="${escapeHtml(itemInfo.name)}" class="item-addon-slot-icon" />` : `<span class="item-addon-slot-empty-icon">🎒</span>`}
          </div>
          <div class="item-addon-slot-meta">
            <div class="item-addon-slot-name">${itemInfo ? escapeHtml(itemInfo.name) : escapeHtml(t('noItemEquipped'))}</div>
            <div class="item-addon-slot-sub">${itemInfo ? (itemInfo.isEvent ? escapeHtml(t('itemEventBadge')) : escapeHtml(t('itemCategoryGegenstand'))) : escapeHtml(t('clickToRoll'))}</div>
          </div>
        </div>
      `;

      slotsHtml += [0, 1].map(idx => {
        if (!canHaveAddons) {
          return `
            <div class="item-addon-slot-card locked-slot" title="${escapeHtml(t('noAddonsPossibleItem'))}">
              <div class="item-addon-slot-icon-wrap">
                <span class="item-addon-slot-empty-icon">🔒</span>
              </div>
              <div class="item-addon-slot-meta">
                <div class="item-addon-slot-name" style="color:var(--text-muted)">${escapeHtml(t('noAddonPossible'))}</div>
                <div class="item-addon-slot-sub">${escapeHtml(t('slotLocked'))}</div>
              </div>
            </div>
          `;
        }
        const addPath = currentAddons[idx];
        const addInfo = addPath ? getAddonInfo(addPath, 'survivor') : null;
        return `
          <div class="item-addon-slot-card interactive" data-random-survivor-addon-slot="${idx}" data-side="${side}" title="${addInfo ? `${escapeHtml(addInfo.name)} — ${escapeHtml(t('rerollSingleAddonTitle'))}` : escapeHtml(t('clickToRoll'))}">
            <div class="item-addon-slot-icon-wrap">
              ${addInfo ? `<img src="${escapeHtml(addInfo.path)}" alt="${escapeHtml(addInfo.name)}" class="item-addon-slot-icon" />` : `<span class="item-addon-slot-empty-icon">🎲</span>`}
            </div>
            <div class="item-addon-slot-meta">
              <div class="item-addon-slot-name">${addInfo ? escapeHtml(addInfo.name) : 'Addon ' + (idx + 1)}</div>
              <div class="item-addon-slot-sub">${addInfo ? escapeHtml(t('matchingAddonSubtitle')) : escapeHtml(t('clickToRoll'))}</div>
            </div>
          </div>
        `;
      }).join('');

      slotsEl.innerHTML = slotsHtml;

      actionsEl.querySelector(`[data-reroll-survivor-loadout="${side}"]`).addEventListener('click', () => {
        const rolled = rollRandomSurvivorItemAndAddons(poolMode);
        if (side === 'A') {
          editingItemA = rolled.item;
          editingAddonsA = rolled.addons;
          match.randomItemA = rolled.item;
          match.randomAddonsA = [...rolled.addons];
        } else {
          editingItemB = rolled.item;
          editingAddonsB = rolled.addons;
          match.randomItemB = rolled.item;
          match.randomAddonsB = [...rolled.addons];
        }
        saveAllState();
        renderModalItemAddonLoadouts();
      });

      slotsEl.querySelector(`[data-random-survivor-item="${side}"]`).addEventListener('click', () => {
        const rolled = rollRandomSurvivorItemAndAddons(poolMode, currentItem);
        if (side === 'A') {
          editingItemA = rolled.item;
          editingAddonsA = rolled.addons;
          match.randomItemA = rolled.item;
          match.randomAddonsA = [...rolled.addons];
        } else {
          editingItemB = rolled.item;
          editingAddonsB = rolled.addons;
          match.randomItemB = rolled.item;
          match.randomAddonsB = [...rolled.addons];
        }
        saveAllState();
        renderModalItemAddonLoadouts();
      });

      slotsEl.querySelectorAll('[data-random-survivor-addon-slot]').forEach(card => {
        card.addEventListener('click', () => {
          const sIdx = parseInt(card.dataset.randomSurvivorAddonSlot, 10);
          const otherIdx = sIdx === 0 ? 1 : 0;
          const exclude = [currentAddons[otherIdx]].filter(Boolean);
          const rolled = rollRandomSurvivorAddonsForItem(currentItem, 1, exclude)[0];
          if (rolled) {
            currentAddons[sIdx] = rolled;
            if (side === 'A') match.randomAddonsA = [...currentAddons];
            else match.randomAddonsB = [...currentAddons];
            saveAllState();
            renderModalItemAddonLoadouts();
          }
        });
      });
      return;
    }

    // Survivor Custom Mode
    labelEl.textContent = t('survivorItemAddonCustomTitle');
    actionsEl.innerHTML = `
      <button type="button" class="btn btn-secondary btn-xs" data-custom-survivor-rand="${side}" title="${escapeHtml(t('btnRandom'))}">${escapeHtml(t('btnRandom'))}</button>
      <button type="button" class="btn btn-secondary btn-xs" data-custom-survivor-clear="${side}" title="${escapeHtml(t('btnClearSlot'))}">🗑️</button>
    `;

    const itemInfo = currentItem ? getItemInfo(currentItem) : null;
    const canHaveAddons = itemInfo && itemInfo.type !== 'firecracker' && itemInfo.type !== 'fogvial';

    let slotsHtml = `
      <div class="item-addon-slot-card interactive" data-custom-survivor-item="${side}" title="${itemInfo ? `${escapeHtml(itemInfo.name)} — ${escapeHtml(t('clickToChange'))}` : escapeHtml(t('chooseItemTitle'))}">
        <div class="item-addon-slot-icon-wrap">
          ${itemInfo ? `<img src="${escapeHtml(itemInfo.path)}" alt="${escapeHtml(itemInfo.name)}" class="item-addon-slot-icon" />` : `<span class="item-addon-slot-empty-icon">🎒</span>`}
        </div>
        <div class="item-addon-slot-meta">
          <div class="item-addon-slot-name">${itemInfo ? escapeHtml(itemInfo.name) : escapeHtml(t('chooseItemTitle'))}</div>
          <div class="item-addon-slot-sub">${itemInfo ? (itemInfo.isEvent ? escapeHtml(t('itemEventBadge')) : escapeHtml(t('itemCategoryGegenstand'))) : escapeHtml(t('chooseSlot'))}</div>
        </div>
      </div>
    `;

    slotsHtml += [0, 1].map(idx => {
      if (!currentItem) {
        return `
          <div class="item-addon-slot-card locked-slot" title="${escapeHtml(t('firstSelectItemLocked'))}">
            <div class="item-addon-slot-icon-wrap">
              <span class="item-addon-slot-empty-icon">🔒</span>
            </div>
            <div class="item-addon-slot-meta">
              <div class="item-addon-slot-name" style="color:var(--text-muted)">${escapeHtml(t('firstSelectItem'))}</div>
              <div class="item-addon-slot-sub">${escapeHtml(t('slotLocked'))}</div>
            </div>
          </div>
        `;
      }
      if (!canHaveAddons) {
        return `
          <div class="item-addon-slot-card locked-slot" title="${escapeHtml(t('noAddonsPossibleItem'))}">
            <div class="item-addon-slot-icon-wrap">
              <span class="item-addon-slot-empty-icon">🚫</span>
            </div>
            <div class="item-addon-slot-meta">
              <div class="item-addon-slot-name" style="color:var(--text-muted)">${escapeHtml(t('noAddonPossible'))}</div>
              <div class="item-addon-slot-sub">${escapeHtml(t('notAllowed'))}</div>
            </div>
          </div>
        `;
      }
      const addPath = currentAddons[idx];
      const addInfo = addPath ? getAddonInfo(addPath, 'survivor') : null;
      return `
        <div class="item-addon-slot-card interactive" data-custom-survivor-addon-slot="${idx}" data-side="${side}" title="${addInfo ? `${escapeHtml(addInfo.name)} — ${escapeHtml(t('clickToChange'))}` : escapeHtml(t('chooseAddonTitle'))}">
          <div class="item-addon-slot-icon-wrap">
            ${addInfo ? `<img src="${escapeHtml(addInfo.path)}" alt="${escapeHtml(addInfo.name)}" class="item-addon-slot-icon" />` : `<span class="item-addon-slot-empty-icon">＋</span>`}
          </div>
          <div class="item-addon-slot-meta">
            <div class="item-addon-slot-name">${addInfo ? escapeHtml(addInfo.name) : 'Addon ' + (idx + 1)}</div>
            <div class="item-addon-slot-sub">${addInfo ? escapeHtml(t('matchingAddonSubtitle')) : escapeHtml(t('chooseSlot'))}</div>
          </div>
        </div>
      `;
    }).join('');

    slotsEl.innerHTML = slotsHtml;

    actionsEl.querySelector(`[data-custom-survivor-rand="${side}"]`).addEventListener('click', () => {
      const rand = rollRandomSurvivorItemAndAddons(poolMode);
      if (side === 'A') {
        editingItemA = rand.item;
        editingAddonsA = rand.addons;
      } else {
        editingItemB = rand.item;
        editingAddonsB = rand.addons;
      }
      renderModalItemAddonLoadouts();
    });

    actionsEl.querySelector(`[data-custom-survivor-clear="${side}"]`).addEventListener('click', () => {
      if (side === 'A') {
        editingItemA = null;
        editingAddonsA = [null, null];
      } else {
        editingItemB = null;
        editingAddonsB = [null, null];
      }
      renderModalItemAddonLoadouts();
    });

    slotsEl.querySelector(`[data-custom-survivor-item="${side}"]`).addEventListener('click', () => {
      openItemAddonPickerModal(side, 'item', 0);
    });

    slotsEl.querySelectorAll('[data-custom-survivor-addon-slot]').forEach(card => {
      card.addEventListener('click', () => {
        const sIdx = parseInt(card.dataset.customSurvivorAddonSlot, 10);
        openItemAddonPickerModal(side, 'addon', sIdx);
      });
    });
  });
}

function openItemAddonPickerModal(side, targetType, slotIndex) {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  activeItemAddonPickerTarget = { side, targetType, slotIndex };
  const charId = side === 'A' ? match.killerA : match.killerB;
  const charObj = getCharacter(charId);

  const titleEl = document.getElementById('itemAddonPickerTitle');
  const catSelect = document.getElementById('filterItemAddonCategory');
  const searchInput = document.getElementById('searchItemAddonInput');

  if (searchInput) searchInput.value = '';

  if (targetType === 'item') {
    if (titleEl) titleEl.textContent = `${t('pickItemTitle')} • ${charObj.title}`;
    if (catSelect) {
      catSelect.innerHTML = `
        <option value="all">${escapeHtml(t('catAllItems'))}</option>
        <option value="medkit">${escapeHtml(t('catMedkits'))}</option>
        <option value="toolbox">${escapeHtml(t('catToolboxes'))}</option>
        <option value="flashlight">${escapeHtml(t('catFlashlights'))}</option>
        <option value="key">${escapeHtml(t('catKeys'))}</option>
        <option value="map">${escapeHtml(t('catMaps'))}</option>
        <option value="firecracker">${escapeHtml(t('catFirecrackers'))}</option>
      `;
      catSelect.value = 'all';
    }
  } else {
    // targetType === 'addon'
    if (currentRole === 'killer') {
      if (titleEl) titleEl.textContent = `${t('pickKillerAddonTitle')} • ${charObj.title} • ${t('slotWord')} ${slotIndex + 1}`;
      if (catSelect) {
        catSelect.innerHTML = `<option value="all">${escapeHtml(t('allAddonsForChar').replace('{char}', charObj.title))}</option>`;
        catSelect.value = 'all';
      }
    } else {
      // survivor addon
      const currentItem = side === 'A' ? editingItemA : editingItemB;
      const itemInfo = currentItem ? getItemInfo(currentItem) : null;
      if (titleEl) titleEl.textContent = `${t('pickAddonTitle')} • ${itemInfo ? escapeHtml(itemInfo.name) : 'Item'} • ${t('slotWord')} ${slotIndex + 1}`;
      if (catSelect) {
        catSelect.innerHTML = `<option value="all">${escapeHtml(t('matchingAddonsFor').replace('{type}', itemInfo ? itemInfo.type : ''))}</option>`;
        catSelect.value = 'all';
      }
    }
  }

  renderItemAddonPickerGrid();
  document.getElementById('itemAddonPickerModal').classList.remove('hidden');
  if (searchInput) searchInput.focus();
}

function closeItemAddonPickerModal() {
  const modal = document.getElementById('itemAddonPickerModal');
  if (modal) modal.classList.add('hidden');
  activeItemAddonPickerTarget = null;
}

function renderItemAddonPickerGrid() {
  const grid = document.getElementById('itemAddonPickerGrid');
  if (!grid || !activeItemAddonPickerTarget || !editingMatchRef) return;

  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  const { side, targetType, slotIndex } = activeItemAddonPickerTarget;
  const charId = side === 'A' ? match.killerA : match.killerB;
  const search = (document.getElementById('searchItemAddonInput')?.value || '').toLowerCase().trim();
  const filterCat = document.getElementById('filterItemAddonCategory')?.value || 'all';

  if (targetType === 'item') {
    // Survivor Items
    const poolMode = getCurrentConfig().itemPoolMode || 'basis';
    const items = getSurvivorItems(poolMode);
    const filtered = items.filter(it => {
      if (filterCat !== 'all' && it.type !== filterCat) return false;
      if (search) {
        const name = formatItemAddonDisplayName(it.file).toLowerCase();
        if (!name.includes(search) && !it.type.toLowerCase().includes(search)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding: 1.5rem;">${escapeHtml(t('noItemsFound'))}</p>`;
      return;
    }

    const currentItem = side === 'A' ? editingItemA : editingItemB;
    grid.innerHTML = filtered.map(it => {
      const name = formatItemAddonDisplayName(it.file);
      const isSelected = currentItem === it.path;
      return `
        <div class="perk-picker-item ${isSelected ? 'selected' : ''}" data-item-path="${escapeHtml(it.path)}">
          <div class="perk-slot-icon-wrap">
            <img src="${escapeHtml(it.path)}" alt="${escapeHtml(name)}" class="perk-slot-icon" loading="lazy" />
          </div>
          <div class="perk-slot-meta">
            <div class="perk-picker-name">${escapeHtml(name)}</div>
            <div class="perk-picker-owner">
              ${escapeHtml(it.type.toUpperCase())}
              ${it.isEvent ? ` • <span style="color:#f59e0b">${escapeHtml(t('itemEventBadge'))}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-item-path]').forEach(card => {
      card.addEventListener('click', () => {
        const pickedPath = card.dataset.itemPath;
        const oldItem = side === 'A' ? editingItemA : editingItemB;
        if (side === 'A') editingItemA = pickedPath;
        else editingItemB = pickedPath;

        // If item changed, check compatibility of current addons
        const oldInfo = oldItem ? getItemInfo(oldItem) : null;
        const newInfo = getItemInfo(pickedPath);
        if (!oldInfo || oldInfo.type !== newInfo.type) {
          if (side === 'A') editingAddonsA = [null, null];
          else editingAddonsB = [null, null];
        }

        closeItemAddonPickerModal();
        renderModalItemAddonLoadouts();
      });
    });
    return;
  }

  // targetType === 'addon'
  if (currentRole === 'killer') {
    const list = (typeof KILLER_ADDONS_CATALOG !== 'undefined' && KILLER_ADDONS_CATALOG[charId])
      ? KILLER_ADDONS_CATALOG[charId]
      : [];
    const currentAddons = side === 'A' ? editingAddonsA : editingAddonsB;
    const activeAddon = currentAddons[slotIndex];

    const filtered = list.filter(p => {
      if (search) {
        const name = formatItemAddonDisplayName(p).toLowerCase();
        if (!name.includes(search)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding: 1.5rem;">${escapeHtml(t('noAddonsFoundForChar'))}</p>`;
      return;
    }

    grid.innerHTML = filtered.map(addPath => {
      const name = formatItemAddonDisplayName(addPath);
      const isSelected = activeAddon === addPath;
      const otherSlot = slotIndex === 0 ? 1 : 0;
      const isEquippedOtherSlot = currentAddons[otherSlot] === addPath;
      return `
        <div class="perk-picker-item ${isSelected ? 'selected' : ''}" data-addon-path="${escapeHtml(addPath)}" style="${isEquippedOtherSlot ? 'opacity:0.45;' : ''}">
          <div class="perk-slot-icon-wrap">
            <img src="${escapeHtml(addPath)}" alt="${escapeHtml(name)}" class="perk-slot-icon" loading="lazy" />
          </div>
          <div class="perk-slot-meta">
            <div class="perk-picker-name">${escapeHtml(name)}</div>
            <div class="perk-picker-owner">
              Killer-Addon ${isEquippedOtherSlot ? ` • (${escapeHtml(t('alreadyEquippedOtherSlot'))})` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-addon-path]').forEach(card => {
      card.addEventListener('click', () => {
        const pickedPath = card.dataset.addonPath;
        const otherSlot = slotIndex === 0 ? 1 : 0;
        if (currentAddons[otherSlot] === pickedPath) {
          currentAddons[otherSlot] = currentAddons[slotIndex] || null;
        }
        currentAddons[slotIndex] = pickedPath;
        closeItemAddonPickerModal();
        renderModalItemAddonLoadouts();
      });
    });
    return;
  }

  // Survivor Addons
  const currentItem = side === 'A' ? editingItemA : editingItemB;
  const itemInfo = currentItem ? getItemInfo(currentItem) : null;
  const currentAddons = side === 'A' ? editingAddonsA : editingAddonsB;
  const activeAddon = currentAddons[slotIndex];

  if (!itemInfo || itemInfo.type === 'firecracker' || itemInfo.type === 'fogvial') {
    grid.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding: 1.5rem;">${escapeHtml(t('noAddonsPossibleForThisItem'))}</p>`;
    return;
  }

  const compatible = getSurvivorAddonsForItem(currentItem);
  const filtered = compatible.filter(a => {
    if (search) {
      const name = formatItemAddonDisplayName(a.file).toLowerCase();
      if (!name.includes(search)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding: 1.5rem;">${escapeHtml(t('noAddonsFound'))}</p>`;
    return;
  }

  grid.innerHTML = filtered.map(a => {
    const name = formatItemAddonDisplayName(a.file);
    const isSelected = activeAddon === a.path;
    const otherSlot = slotIndex === 0 ? 1 : 0;
    const isEquippedOtherSlot = currentAddons[otherSlot] === a.path;
    return `
      <div class="perk-picker-item ${isSelected ? 'selected' : ''}" data-addon-path="${escapeHtml(a.path)}" style="${isEquippedOtherSlot ? 'opacity:0.45;' : ''}">
        <div class="perk-slot-icon-wrap">
          <img src="${escapeHtml(a.path)}" alt="${escapeHtml(name)}" class="perk-slot-icon" loading="lazy" />
        </div>
        <div class="perk-slot-meta">
          <div class="perk-picker-name">${escapeHtml(name)}</div>
          <div class="perk-picker-owner">
            ${escapeHtml(a.type.toUpperCase())}-Addon ${isEquippedOtherSlot ? ` • (${escapeHtml(t('alreadyEquippedOtherSlot'))})` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-addon-path]').forEach(card => {
    card.addEventListener('click', () => {
      const pickedPath = card.dataset.addonPath;
      const otherSlot = slotIndex === 0 ? 1 : 0;
      if (currentAddons[otherSlot] === pickedPath) {
        currentAddons[otherSlot] = currentAddons[slotIndex] || null;
      }
      currentAddons[slotIndex] = pickedPath;
      closeItemAddonPickerModal();
      renderModalItemAddonLoadouts();
    });
  });
}

function configureModalControlsForMode() {
  const mode = getCurrentConfig().scoringMode;
  const isKiller = currentRole === 'killer';

  const killsBlockA = document.getElementById('killsBlockA');
  const killsBlockB = document.getElementById('killsBlockB');
  const hooksBlockA = document.getElementById('hooksBlockA');
  const hooksBlockB = document.getElementById('hooksBlockB');

  const labelKillsA = document.getElementById('labelKillsA');
  const labelKillsB = document.getElementById('labelKillsB');
  const labelHooksA = document.getElementById('labelHooksA');
  const labelHooksB = document.getElementById('labelHooksB');

  const quickPillsA = document.getElementById('quickPillsStat1A');
  const quickPillsB = document.getElementById('quickPillsStat1B');
  const quickHookPillsA = document.getElementById('quickPillsStat2A');
  const quickHookPillsB = document.getElementById('quickPillsStat2B');

  const inputKillsA = document.getElementById('inputKillsA');
  const inputKillsB = document.getElementById('inputKillsB');
  const stepperA = document.getElementById('stepperStat2A');
  const stepperB = document.getElementById('stepperStat2B');

  // Reset display styles
  killsBlockA.classList.remove('hidden');
  killsBlockB.classList.remove('hidden');
  hooksBlockA.classList.remove('hidden');
  hooksBlockB.classList.remove('hidden');

  if (isKiller) {
    killsBlockA.classList.toggle('hidden', mode === 'hooks_only');
    killsBlockB.classList.toggle('hidden', mode === 'hooks_only');
    hooksBlockA.classList.toggle('hidden', mode === 'kills_only' || mode === 'custom_score');
    hooksBlockB.classList.toggle('hidden', mode === 'kills_only' || mode === 'custom_score');

    labelKillsA.textContent = mode === 'hooks_kills' ? t('killerKillsTieLabel') : (mode === 'custom_score' ? t('pointsForDuel') : t('killerKillsMainLabel'));
    labelKillsB.textContent = mode === 'hooks_kills' ? t('killerKillsTieLabel') : (mode === 'custom_score' ? t('pointsForDuel') : t('killerKillsMainLabel'));
    labelHooksA.textContent = mode === 'kills_hooks' ? t('killerHooksTieLabel') : t('killerHooksMainLabel');
    labelHooksB.textContent = mode === 'kills_hooks' ? t('killerHooksTieLabel') : t('killerHooksMainLabel');

    const isCustom = mode === 'custom_score';
    inputKillsA.style.display = isCustom ? 'block' : 'none';
    inputKillsB.style.display = isCustom ? 'block' : 'none';

    const pillsHtml = (side) => [0, 1, 2, 3, 4].map(v =>
      `<button type="button" class="pill-btn" data-side="${side}" data-val="${v}">${v}</button>`
    ).join('');

    quickPillsA.innerHTML = isCustom ? '' : pillsHtml('A');
    quickPillsB.innerHTML = isCustom ? '' : pillsHtml('B');

    const hookPillsHtml = (side) => [0, 4, 6, 8, 10, 12].map(v =>
      `<button type="button" class="mini-pill" data-side="${side}" data-val="${v}">${v}</button>`
    ).join('');

    quickHookPillsA.innerHTML = hookPillsHtml('A');
    quickHookPillsB.innerHTML = hookPillsHtml('B');
  } else {
    // Survivor Modes:
    if (mode === 'escapes_gens' || mode === 'gens_escapes') {
      labelKillsA.textContent = t('survivorEscapedLabel');
      labelKillsB.textContent = t('survivorEscapedLabel');
      labelHooksA.textContent = t('survivorGensLabel');
      labelHooksB.textContent = t('survivorGensLabel');

      inputKillsA.style.display = 'none';
      inputKillsB.style.display = 'none';

      quickPillsA.innerHTML = `
        <button type="button" class="pill-btn" data-side="A" data-val="0" style="grid-column: span 2;">${escapeHtml(t('statDead'))} (0)</button>
        <button type="button" class="pill-btn" data-side="A" data-val="1" style="grid-column: span 3;">${escapeHtml(t('statEscaped'))} (1)</button>
      `;
      quickPillsB.innerHTML = `
        <button type="button" class="pill-btn" data-side="B" data-val="0" style="grid-column: span 2;">${escapeHtml(t('statDead'))} (0)</button>
        <button type="button" class="pill-btn" data-side="B" data-val="1" style="grid-column: span 3;">${escapeHtml(t('statEscaped'))} (1)</button>
      `;

      const genPillsHtml = (side) => [0, 1, 2, 3, 4, 5].map(v =>
        `<button type="button" class="mini-pill" data-side="${side}" data-val="${v}">${v}</button>`
      ).join('');

      quickHookPillsA.innerHTML = genPillsHtml('A');
      quickHookPillsB.innerHTML = genPillsHtml('B');
    } else if (mode === 'bloodpoints') {
      labelKillsA.textContent = t('survivorBloodpointsLabel');
      labelKillsB.textContent = t('survivorBloodpointsLabel');
      hooksBlockA.classList.add('hidden');
      hooksBlockB.classList.add('hidden');

      inputKillsA.style.display = 'block';
      inputKillsB.style.display = 'block';

      quickPillsA.innerHTML = `
        <button type="button" class="pill-btn" data-side="A" data-val="15000">15k</button>
        <button type="button" class="pill-btn" data-side="A" data-val="20000">20k</button>
        <button type="button" class="pill-btn" data-side="A" data-val="25000">25k</button>
        <button type="button" class="pill-btn" data-side="A" data-val="30000">30k</button>
        <button type="button" class="pill-btn" data-side="A" data-val="35000">35k</button>
      `;
      quickPillsB.innerHTML = `
        <button type="button" class="pill-btn" data-side="B" data-val="15000">15k</button>
        <button type="button" class="pill-btn" data-side="B" data-val="20000">20k</button>
        <button type="button" class="pill-btn" data-side="B" data-val="25000">25k</button>
        <button type="button" class="pill-btn" data-side="B" data-val="30000">30k</button>
        <button type="button" class="pill-btn" data-side="B" data-val="35000">35k</button>
      `;
    } else if (mode === 'survival_time') {
      labelKillsA.textContent = t('survivorSurvivalTimeLabel');
      labelKillsB.textContent = t('survivorSurvivalTimeLabel');
      hooksBlockA.classList.add('hidden');
      hooksBlockB.classList.add('hidden');

      inputKillsA.style.display = 'block';
      inputKillsB.style.display = 'block';

      quickPillsA.innerHTML = `
        <button type="button" class="pill-btn" data-side="A" data-val="120">2m</button>
        <button type="button" class="pill-btn" data-side="A" data-val="240">4m</button>
        <button type="button" class="pill-btn" data-side="A" data-val="360">6m</button>
        <button type="button" class="pill-btn" data-side="A" data-val="480">8m</button>
        <button type="button" class="pill-btn" data-side="A" data-val="600">10m</button>
      `;
      quickPillsB.innerHTML = `
        <button type="button" class="pill-btn" data-side="B" data-val="120">2m</button>
        <button type="button" class="pill-btn" data-side="B" data-val="240">4m</button>
        <button type="button" class="pill-btn" data-side="B" data-val="360">6m</button>
        <button type="button" class="pill-btn" data-side="B" data-val="480">8m</button>
        <button type="button" class="pill-btn" data-side="B" data-val="600">10m</button>
      `;
    } else {
      // custom_score
      labelKillsA.textContent = `${t('pointsForDuel')} A`;
      labelKillsB.textContent = `${t('pointsForDuel')} B`;
      hooksBlockA.classList.add('hidden');
      hooksBlockB.classList.add('hidden');

      inputKillsA.style.display = 'block';
      inputKillsB.style.display = 'block';
      quickPillsA.innerHTML = '';
      quickPillsB.innerHTML = '';
    }
  }

  // Bind dynamic pill events
  document.querySelectorAll('#quickPillsStat1A .pill-btn, #quickPillsStat1B .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      const val = parseInt(btn.dataset.val, 10);
      setModalStat1(side, val, true);
    });
  });

  document.querySelectorAll('#quickPillsStat2A .mini-pill, #quickPillsStat2B .mini-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      document.getElementById(`inputHooks${side}`).value = btn.dataset.val;
      updateModalLiveVerdict();
    });
  });
}

function checkModalPlayerOwnershipWarnings() {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  if (!match) return;

  const pA = getPlayer(document.getElementById('selectModalPlayerA').value);
  const pB = getPlayer(document.getElementById('selectModalPlayerB').value);

  const ownsA = pA && getPlayerOwnedIds(pA, currentRole).includes(match.killerA);
  const ownsB = pB && getPlayerOwnedIds(pB, currentRole).includes(match.killerB);

  document.getElementById('warnOwnA').classList.toggle('hidden', !!ownsA);
  document.getElementById('warnOwnB').classList.toggle('hidden', !!ownsB);
}

function setModalStat1(side, val, autoAdjustStat2 = false) {
  const input = document.getElementById(`inputKills${side}`);
  input.value = val;

  document.querySelectorAll(`#quickPillsStat1${side} .pill-btn`).forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.val, 10) === val);
  });

  if (autoAdjustStat2) {
    const stat2Input = document.getElementById(`inputHooks${side}`);
    const curVal2 = parseInt(stat2Input.value, 10) || 0;
    if (currentRole === 'killer') {
      if (val === 4 && curVal2 < 8) stat2Input.value = 12;
      else if (curVal2 < val) stat2Input.value = Math.min(12, val * 2 + 2);
    } else {
      if (val === 1 && curVal2 < 2) stat2Input.value = 3;
    }
  }
  updateModalLiveVerdict();
}

function getModalTempMatch() {
  const killsA = Math.max(0, parseInt(document.getElementById('inputKillsA').value, 10) || 0);
  const killsB = Math.max(0, parseInt(document.getElementById('inputKillsB').value, 10) || 0);
  const hooksA = Math.max(0, parseInt(document.getElementById('inputHooksA').value, 10) || 0);
  const hooksB = Math.max(0, parseInt(document.getElementById('inputHooksB').value, 10) || 0);
  return { killsA, killsB, hooksA, hooksB, tieWinner: editingTieWinner };
}

function updateModalLiveVerdict() {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  const kA = getCharacter(match.killerA);
  const kB = getCharacter(match.killerB);
  const isKo = editingMatchRef.type !== 'group';

  const temp = getModalTempMatch();
  const rawWinner = determineMatchWinnerSide({ ...temp, tieWinner: null }, false);

  const tieBox = document.getElementById('koTiebreakerBox');
  if (isKo && rawWinner === 'DRAW') {
    tieBox.classList.remove('hidden');
  } else {
    tieBox.classList.add('hidden');
    editingTieWinner = null;
  }

  document.getElementById('btnTieWinnerA').classList.toggle('selected-tie', editingTieWinner === 'A');
  document.getElementById('btnTieWinnerB').classList.toggle('selected-tie', editingTieWinner === 'B');

  const finalWinner = determineMatchWinnerSide({ ...temp, tieWinner: editingTieWinner }, isKo);
  const verdictEl = document.getElementById('modalLiveVerdict');
  const cardA = document.getElementById('modalCardA');
  const cardB = document.getElementById('modalCardB');

  cardA.classList.toggle('leading', finalWinner === 'A');
  cardB.classList.toggle('leading', finalWinner === 'B');

  if (finalWinner === 'A') {
    verdictEl.textContent = `🏆 ${t('winnerBadge', 'Sieger:')} ${kA.title}`;
  } else if (finalWinner === 'B') {
    verdictEl.textContent = `🏆 ${t('winnerBadge', 'Sieger:')} ${kB.title}`;
  } else {
    verdictEl.textContent = isKo ? t('tieBreakerNotice') : t('drawWithPoints');
  }
}

function saveMatchModalResult() {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  const isKo = editingMatchRef.type !== 'group';
  const temp = getModalTempMatch();

  const finalWinner = determineMatchWinnerSide(temp, isKo);
  if (isKo && finalWinner === 'DRAW') {
    alert(t('alertKoTieRequired'));
    return;
  }

  match.killsA = temp.killsA;
  match.killsB = temp.killsB;
  match.hooksA = temp.hooksA;
  match.hooksB = temp.hooksB;
  match.playerA = document.getElementById('selectModalPlayerA').value;
  match.playerB = document.getElementById('selectModalPlayerB').value;
  match.tieWinner = isKo ? editingTieWinner : null;
  match.note = document.getElementById('inputMatchNote').value.trim();

  // Persist perks based on active perk mode
  const perkMode = getCurrentConfig().perkMode || 'random';
  if (perkMode === 'custom') {
    match.customPerksA = [...editingPerksA];
    match.customPerksB = [...editingPerksB];
  } else if (perkMode === 'random') {
    match.randomPerksA = [...editingPerksA];
    match.randomPerksB = [...editingPerksB];
  }

  // Persist items & addons based on active itemAddonMode
  const itemAddonMode = getCurrentConfig().itemAddonMode || 'random';
  if (itemAddonMode === 'custom') {
    match.customItemA = editingItemA;
    match.customItemB = editingItemB;
    match.customAddonsA = [...editingAddonsA];
    match.customAddonsB = [...editingAddonsB];
  } else if (itemAddonMode === 'random') {
    match.randomItemA = editingItemA;
    match.randomItemB = editingItemB;
    match.randomAddonsA = [...editingAddonsA];
    match.randomAddonsB = [...editingAddonsB];
  }

  match.played = true;

  if (isKo) {
    propagateBracketWinners();
  }

  saveAllState();
  closeMatchModal();
  renderAll();
}

function clearMatchModalResult() {
  if (!editingMatchRef) return;
  const match = findMatchObject(editingMatchRef);
  match.played = false;
  match.killsA = 0;
  match.killsB = 0;
  match.hooksA = 0;
  match.hooksB = 0;
  match.tieWinner = null;
  match.note = '';

  if (editingMatchRef.type !== 'group') {
    propagateBracketWinners();
  }
  saveAllState();
  closeMatchModal();
  renderAll();
}

function closeMatchModal() {
  document.getElementById('matchModal').classList.add('hidden');
  editingMatchRef = null;
}

/* ==================== SIMULATION HELPERS ==================== */
function generateRealisticScore() {
  const isKiller = currentRole === 'killer';
  const mode = getCurrentConfig().scoringMode;

  if (isKiller) {
    const weights = [0.08, 0.17, 0.28, 0.25, 0.22];
    const r = Math.random();
    let acc = 0;
    let kills = 2;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (r <= acc) { kills = i; break; }
    }
    const minHooks = kills * 2 + (kills < 4 ? Math.floor(Math.random() * 3) : 0);
    const maxHooks = Math.min(12, kills * 3 + (4 - kills) * 2);
    const hooks = Math.min(12, Math.max(kills, minHooks + Math.floor(Math.random() * (maxHooks - minHooks + 1))));
    return { stat1: kills, stat2: hooks };
  } else {
    // Survivor simulations
    if (mode === 'bloodpoints') {
      const bp = Math.floor(14000 + Math.random() * 21000);
      return { stat1: bp, stat2: 0 };
    } else if (mode === 'survival_time') {
      const s = Math.floor(180 + Math.random() * 480);
      return { stat1: s, stat2: 0 };
    } else {
      // escapes_gens / gens_escapes
      const escaped = Math.random() < 0.45 ? 1 : 0;
      const gens = Math.floor(Math.random() * 4) + (escaped ? 1 : 0);
      return { stat1: escaped, stat2: Math.min(5, gens) };
    }
  }
}

function simulateModalMatch() {
  const sA = generateRealisticScore();
  const sB = generateRealisticScore();
  setModalStat1('A', sA.stat1, false);
  setModalStat1('B', sB.stat1, false);
  document.getElementById('inputHooksA').value = sA.stat2;
  document.getElementById('inputHooksB').value = sB.stat2;

  if (editingMatchRef && editingMatchRef.type !== 'group' && sA.stat1 === sB.stat1 && sA.stat2 === sB.stat2) {
    editingTieWinner = Math.random() < 0.5 ? 'A' : 'B';
  }
  updateModalLiveVerdict();
}

function simulateRemainingGroupMatches() {
  let count = 0;
  const tourney = getCurrentTournament();
  tourney.groups.forEach(g => {
    g.matches.forEach(m => {
      if (!m.played) {
        const sA = generateRealisticScore();
        const sB = generateRealisticScore();
        m.killsA = sA.stat1;
        m.hooksA = sA.stat2;
        m.killsB = sB.stat1;
        m.hooksB = sB.stat2;
        m.played = true;
        count++;
      }
    });
  });

  if (count === 0) {
    alert(t('alertAllGroupMatchesDone'));
    return;
  }

  saveAllState();
  renderAll();
}

function simulateActiveKnockoutRound() {
  propagateBracketWinners();
  const tourney = getCurrentTournament();
  const rounds = tourney.bracket.rounds || [];

  let simulated = 0;
  for (const r of rounds) {
    const playable = r.matches.filter(m => !m.played && m.killerA && m.killerB);
    if (playable.length > 0) {
      playable.forEach(m => {
        const sA = generateRealisticScore();
        const sB = generateRealisticScore();
        m.killsA = sA.stat1;
        m.hooksA = sA.stat2;
        m.killsB = sB.stat1;
        m.hooksB = sB.stat2;
        m.tieWinner = (sA.stat1 === sB.stat1 && sA.stat2 === sB.stat2) ? (Math.random() < 0.5 ? 'A' : 'B') : null;
        m.played = true;
        simulated++;
      });
      break;
    }
  }

  const tp = tourney.bracket.thirdPlace;
  if (simulated === 0 && tp && !tp.played && tp.killerA && tp.killerB) {
    const sA = generateRealisticScore();
    const sB = generateRealisticScore();
    tp.killsA = sA.stat1;
    tp.hooksA = sA.stat2;
    tp.killsB = sB.stat1;
    tp.hooksB = sB.stat2;
    tp.tieWinner = (sA.stat1 === sB.stat1 && sA.stat2 === sB.stat2) ? (Math.random() < 0.5 ? 'A' : 'B') : null;
    tp.played = true;
    simulated++;
  }

  propagateBracketWinners();
  saveAllState();
  renderBracketView();
  renderStatsView();
}

/* ==================== OVERALL STATS & LEADERBOARD ==================== */
function renderStatsView() {
  const tourney = getCurrentTournament();
  const statsMap = {};
  tourney.groups.forEach(g => {
    g.killerIds.forEach(cId => {
      statsMap[cId] = {
        killerId: cId,
        groupName: g.name,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        killsFor: 0,
        killsAgainst: 0,
        hooksFor: 0,
        hooksAgainst: 0,
        points: 0
      };
    });
  });

  const playerStatsMap = {};
  sharedPlayers.forEach(p => {
    playerStatsMap[p.id] = {
      playerId: p.id,
      name: p.name,
      color: p.color,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      killsFor: 0,
      hooksFor: 0,
      points: 0
    };
  });

  const allMatches = [
    ...tourney.groups.flatMap(g => g.matches.map(m => ({ ...m, isKo: false }))),
    ...(tourney.bracket.rounds || []).flatMap(r => r.matches.map(m => ({ ...m, isKo: true }))),
    ...(tourney.bracket.thirdPlace ? [{ ...tourney.bracket.thirdPlace, isKo: true }] : [])
  ];

  allMatches.forEach(m => {
    if (!m.played || !m.killerA || !m.killerB) return;
    const sA = statsMap[m.killerA];
    const sB = statsMap[m.killerB];
    const w = determineMatchWinnerSide(m, m.isKo);

    if (sA && sB) {
      sA.played++;
      sB.played++;
      sA.killsFor += m.killsA;
      sA.killsAgainst += m.killsB;
      sB.killsFor += m.killsB;
      sB.killsAgainst += m.killsA;
      sA.hooksFor += m.hooksA;
      sA.hooksAgainst += m.hooksB;
      sB.hooksFor += m.hooksB;
      sB.hooksAgainst += m.hooksA;

      if (w === 'A') {
        sA.wins++; sA.points += 3; sB.losses++;
      } else if (w === 'B') {
        sB.wins++; sB.points += 3; sA.losses++;
      } else {
        sA.draws++; sB.draws++; sA.points += 1; sB.points += 1;
      }
    }

    const pA = playerStatsMap[m.playerA];
    const pB = playerStatsMap[m.playerB];
    if (pA) {
      pA.played++;
      pA.killsFor += m.killsA;
      pA.hooksFor += m.hooksA;
      if (w === 'A') { pA.wins++; pA.points += 3; }
      else if (w === 'B') { pA.losses++; }
      else { pA.draws++; pA.points += 1; }
    }
    if (pB) {
      pB.played++;
      pB.killsFor += m.killsB;
      pB.hooksFor += m.hooksB;
      if (w === 'B') { pB.wins++; pB.points += 3; }
      else if (w === 'A') { pB.losses++; }
      else { pB.draws++; pB.points += 1; }
    }
  });

  const playerRows = Object.values(playerStatsMap).sort((a, b) =>
    b.points - a.points || b.killsFor - a.killsFor || b.hooksFor - a.hooksFor
  );

  const isKiller = currentRole === 'killer';
  const mode = getCurrentConfig().scoringMode;

  const playerBody = document.getElementById('playerStatsBody');
  if (playerBody) {
    playerBody.innerHTML = playerRows.map((pr, idx) => {
      let stat1Display = isKiller ? `${pr.killsFor} 💀` : (mode === 'bloodpoints' ? `${pr.killsFor.toLocaleString()} 🩸` : (mode === 'survival_time' ? `${pr.killsFor}s ⏱️` : `${pr.killsFor} 🚪`));
      let stat2Display = isKiller ? `${pr.hooksFor} 🪝` : `${pr.hooksFor} ⚙️`;
      return `
        <tr>
          <td><span class="rank-num">${idx + 1}</span></td>
          <td>
            <div class="table-killer-cell">
              <span class="player-badge-dot" style="background:${pr.color}"></span>
              <span class="table-killer-name">${escapeHtml(pr.name)}</span>
            </div>
          </td>
          <td>${pr.played}</td>
          <td>${pr.wins}</td>
          <td>${pr.draws}</td>
          <td>${pr.losses}</td>
          <td>${stat1Display}</td>
          <td>${stat2Display}</td>
          <td>${pr.played > 0 ? (pr.killsFor / pr.played).toFixed(isKiller ? 2 : (mode === 'bloodpoints' ? 0 : 2)) : '0'}</td>
          <td>${pr.played > 0 ? (pr.hooksFor / pr.played).toFixed(2) : '0.00'}</td>
          <td class="pts-cell">${pr.points}</td>
        </tr>
      `;
    }).join('');
  }

  const rows = Object.values(statsMap).map(r => {
    r.killsDiff = r.killsFor - r.killsAgainst;
    r.hooksDiff = r.hooksFor - r.hooksAgainst;
    r.avgKills = r.played > 0 ? (r.killsFor / r.played).toFixed(isKiller ? 2 : (mode === 'bloodpoints' ? 0 : 2)) : '0.00';
    return r;
  }).sort(compareStandingRows);

  const totalStat1 = rows.reduce((s, r) => s + r.killsFor, 0);
  const totalStat2 = rows.reduce((s, r) => s + r.hooksFor, 0);
  const topPerformer = [...rows].sort((a, b) => b.killsFor - a.killsFor || b.hooksFor - a.hooksFor)[0];

  const highlightsEl = document.getElementById('statsHighlights');
  const topC = topPerformer && topPerformer.killsFor > 0 ? getCharacter(topPerformer.killerId) : null;

  highlightsEl.innerHTML = `
    <div class="stat-highlight-box">
      <div class="stat-icon">${isKiller ? '💀' : '🚪'}</div>
      <div>
        <div class="stat-val">${isKiller ? `${totalStat1} ${t('statUnitKills')}` : (mode === 'bloodpoints' ? `${totalStat1.toLocaleString()} BP` : `${totalStat1} ${t('statUnitEscapes')}`)}</div>
        <div class="stat-lbl">${isKiller ? t('statTotalSacrifices') : (mode === 'bloodpoints' ? t('statTotalBloodpoints') : t('statTotalEscapes'))}</div>
      </div>
    </div>
    <div class="stat-highlight-box">
      <div class="stat-icon">${isKiller ? '🪝' : '⚙️'}</div>
      <div>
        <div class="stat-val">${isKiller ? `${totalStat2} ${t('statUnitHooks')}` : `${totalStat2} ${t('statUnitGens')}`}</div>
        <div class="stat-lbl">${isKiller ? t('statTotalHooks') : t('statTotalGens')}</div>
      </div>
    </div>
    <div class="stat-highlight-box">
      <div class="stat-icon">${isKiller ? '🩸' : '🌟'}</div>
      <div>
        <div class="stat-val">${topC ? `${escapeHtml(topC.title)} (${topPerformer.killsFor})` : t('statTbd')}</div>
        <div class="stat-lbl">${isKiller ? t('statTopSlayer') : t('statTopSurvivor')}</div>
      </div>
    </div>
  `;

  const tbody = document.getElementById('fullStatsBody');
  tbody.innerHTML = rows.map((r, i) => {
    const c = getCharacter(r.killerId);
    const kDiff = r.killsDiff > 0 ? `+${r.killsDiff}` : r.killsDiff;
    const hDiff = r.hooksDiff > 0 ? `+${r.hooksDiff}` : r.hooksDiff;
    return `
      <tr>
        <td><span class="rank-num">${i + 1}</span></td>
        <td>
          <div class="table-killer-cell">
            ${renderCharacterAvatarHtml(c, 'mini-avatar')}
            <div>
              <div class="table-killer-name">${escapeHtml(c.title)}</div>
              <div style="font-size:0.72rem; color:var(--text-secondary)">${escapeHtml(c.name)}</div>
            </div>
          </div>
        </td>
        <td style="font-family:var(--font-sans); color:var(--text-secondary)">${escapeHtml(formatGroupName(r.groupName))}</td>
        <td>${r.played}</td>
        <td>${r.wins}</td>
        <td>${r.draws}</td>
        <td>${r.losses}</td>
        <td>${r.killsFor}:${r.killsAgainst} (${kDiff})</td>
        <td>${r.hooksFor}:${r.hooksAgainst} (${hDiff})</td>
        <td>${r.avgKills}</td>
        <td class="pts-cell">${r.points}</td>
      </tr>
    `;
  }).join('');
}

/* ==================== EXPORT / IMPORT ==================== */
function exportTournamentJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
    currentRole,
    currentActiveView,
    selectedPlayerEditorId,
    sharedPlayers,
    tournamentData
  }, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `dbd-${currentRole}-cup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function importTournamentJson(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (imported.tournamentData) {
        tournamentData = imported.tournamentData;
        if (imported.sharedPlayers) sharedPlayers = imported.sharedPlayers;
        if (imported.currentRole) currentRole = imported.currentRole;
      } else if (imported.killers || imported.characters) {
        // v1/v2 format import
        tournamentData.killer.characters = imported.killers || imported.characters;
        tournamentData.killer.selectedIds = imported.selectedIds || tournamentData.killer.characters.map(c => c.id);
        if (imported.config) tournamentData.killer.config = imported.config;
        if (imported.groups) tournamentData.killer.groups = imported.groups;
        if (imported.bracket) tournamentData.killer.bracket = imported.bracket;
        if (imported.tournamentStarted !== undefined) tournamentData.killer.tournamentStarted = imported.tournamentStarted;
        if (imported.players) sharedPlayers = imported.players;
      } else {
        throw new Error('Ungültiges Turnier-Format');
      }
      saveAllState();
      renderAll();
      alert(t('alertLoadSuccess'));
    } catch (err) {
      alert(t('alertLoadError') + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

/* ==================== UTILITIES ==================== */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


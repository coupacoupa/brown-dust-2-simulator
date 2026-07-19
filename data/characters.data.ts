// Single source of truth for every character in the simulator (game-id order).
//
// Each character lives in its own file under ./characters/<name>.data.ts —
// edit those. This module only imports them and concatenates the roster in
// game-id order. Add a new character by creating its file and wiring it in
// below (import + array entry).

import { CharacterTemplate } from "@/domain.type";

import { lathel } from "./characters/lathel.data";
import { justia } from "./characters/justia.data";
import { scheherazade } from "./characters/scheherazade.data";
import { gray } from "./characters/gray.data";
import { rou } from "./characters/rou.data";
import { olstein } from "./characters/olstein.data";
import { eclipse } from "./characters/eclipse.data";
import { rubia } from "./characters/rubia.data";
import { sylvia } from "./characters/sylvia.data";
import { teresse } from "./characters/teresse.data";
import { liatris } from "./characters/liatris.data";
import { diana } from "./characters/diana.data";
import { layla } from "./characters/layla.data";
import { elpis } from "./characters/elpis.data";
import { loen } from "./characters/loen.data";
import { nebris } from "./characters/nebris.data";
import { morpeah } from "./characters/morpeah.data";
import { sacredJustia } from "./characters/sacred-justia.data";
import { olivier } from "./characters/olivier.data";
import { blade } from "./characters/blade.data";
import { liberta } from "./characters/liberta.data";
import { sonya } from "./characters/sonya.data";
import { darian } from "./characters/darian.data";
import { tyr } from "./characters/tyr.data";
import { palette } from "./characters/palette.data";
import { eris } from "./characters/eris.data";
import { roxy } from "./characters/roxy.data";
import { yomi } from "./characters/yomi.data";
import { yozakura } from "./characters/yozakura.data";
import { yumi } from "./characters/yumi.data";
import { hikage } from "./characters/hikage.data";
import { goblinSlayer } from "./characters/goblin-slayer.data";
import { priestess } from "./characters/priestess.data";
import { highElfArcher } from "./characters/high-elf-archer.data";
import { swordMaiden } from "./characters/sword-maiden.data";
import { ikaruga } from "./characters/ikaruga.data";
import { alec } from "./characters/alec.data";
import { celia } from "./characters/celia.data";
import { anastasia } from "./characters/anastasia.data";
import { lecliss } from "./characters/lecliss.data";
import { rafina } from "./characters/rafina.data";
import { elise } from "./characters/elise.data";
import { helena } from "./characters/helena.data";
import { eleaneer } from "./characters/eleaneer.data";
import { dalvi } from "./characters/dalvi.data";
import { zenith } from "./characters/zenith.data";
import { andrew } from "./characters/andrew.data";
import { ingrid } from "./characters/ingrid.data";
import { cynthia } from "./characters/cynthia.data";
import { julie } from "./characters/julie.data";
import { yuri } from "./characters/yuri.data";
import { nartas } from "./characters/nartas.data";
import { angelica } from "./characters/angelica.data";
import { refithea } from "./characters/refithea.data";
import { glacia } from "./characters/glacia.data";
import { ventana } from "./characters/ventana.data";
import { granhildr } from "./characters/granhildr.data";
import { venaka } from "./characters/venaka.data";
import { levia } from "./characters/levia.data";
import { michaela } from "./characters/michaela.data";
import { luvencia } from "./characters/luvencia.data";
import { wilhelmina } from "./characters/wilhelmina.data";
import { granadair } from "./characters/granadair.data";
import { mamonir } from "./characters/mamonir.data";
import { gynt } from "./characters/gynt.data";
import { fred } from "./characters/fred.data";
import { lisianne } from "./characters/lisianne.data";
import { remnunt } from "./characters/remnunt.data";
import { wiggle } from "./characters/wiggle.data";
import { lucrezia } from "./characters/lucrezia.data";
import { bernie } from "./characters/bernie.data";
import { seir } from "./characters/seir.data";
import { jayden } from "./characters/jayden.data";
import { emma } from "./characters/emma.data";
import { samay } from "./characters/samay.data";
import { kry } from "./characters/kry.data";
import { carlson } from "./characters/carlson.data";
import { lydia } from "./characters/lydia.data";
import { rigenette } from "./characters/rigenette.data";
import { beatrice } from "./characters/beatrice.data";
import { maria } from "./characters/maria.data";
import { arines } from "./characters/arines.data";

export const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  lathel,
  justia,
  scheherazade,
  gray,
  rou,
  olstein,
  eclipse,
  rubia,
  sylvia,
  teresse,
  liatris,
  diana,
  layla,
  elpis,
  loen,
  nebris,
  morpeah,
  sacredJustia,
  olivier,
  blade,
  liberta,
  sonya,
  darian,
  tyr,
  palette,
  eris,
  roxy,
  yomi,
  yozakura,
  yumi,
  hikage,
  goblinSlayer,
  priestess,
  highElfArcher,
  swordMaiden,
  ikaruga,
  alec,
  celia,
  anastasia,
  lecliss,
  rafina,
  elise,
  helena,
  eleaneer,
  dalvi,
  zenith,
  andrew,
  ingrid,
  cynthia,
  julie,
  yuri,
  nartas,
  angelica,
  refithea,
  glacia,
  ventana,
  granhildr,
  venaka,
  levia,
  michaela,
  luvencia,
  wilhelmina,
  granadair,
  mamonir,
  gynt,
  fred,
  lisianne,
  remnunt,
  wiggle,
  lucrezia,
  bernie,
  seir,
  jayden,
  emma,
  samay,
  kry,
  carlson,
  lydia,
  rigenette,
  beatrice,
  maria,
  arines,
];

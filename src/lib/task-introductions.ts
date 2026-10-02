import { NEREntity } from './nlp-parser';

export interface TaskIntroParams {
  seedNode: string;
  muid: string;
  miningDepth?: number | string;
  miningType?: string;
  postCount?: number;
  hashtagCount?: number;
  userCount?: number;
  writers: NEREntity[];
  crews: NEREntity[];
}

export interface GeneratedIntroduction {
  pageTitle: string;
  metaDescription: string;
  editorialParagraph: string;
  jsonLdDescription: string;
  categoryLabel: string;
  entitiesSummary: string;
}

interface SeedProfile {
  categoryLabel: string;
  description: string;
  context: string;
}

const SEED_PROFILES: Record<string, SeedProfile> = {
  afeks: {
    categoryLabel: 'Graffiti Writer (Rolling Stock)',
    description: 'Afeks is an active writer within the North American freight train graffiti scene, recognized for distinctive metallic silver pieces and dynamic typography executed on rail rolling stock.',
    context: 'Instagram network mining reveals frequent co-occurrence with regional writers and crews, tracing the inter-regional circulation of boxcars across major freight corridors.'
  },
  asoter: {
    categoryLabel: 'Graffiti Writer (Rolling Stock)',
    description: 'Asoter is a prolific freight train writer frequently documented across boxcars and intermodal wagons along BNSF and Union Pacific transcontinental lines.',
    context: 'Network density analysis links this cluster with historic crews such as KOG and ODV, indicating sustained prominence in contemporary railroad art.'
  },
  benching: {
    categoryLabel: 'Subculture & Ethnographic Archival',
    description: '"Benching" represents the fundamental ethnographic and photographic practice of the freight graffiti community: observing, archiving, and cataloging painted boxcars and autoracks in classification yards and along trackside spots.',
    context: 'This dataset aggregates the output of dedicated benchers and rail historians who document the ephemeral migration of rolling art across the continent.'
  },
  benchingtrains: {
    categoryLabel: 'Trackside Photography & Archival',
    description: 'Benchingtrains captures trackside action and dynamic observation of active freight consists moving along mainline corridors and industrial staging sidings.',
    context: 'The node reflects the intersection between traditional railfanning photography and the contemporary digital documentation of monikers, end-to-ends, and wholecars.'
  },
  benchmexicocity: {
    categoryLabel: 'Observation Hotspot (Mexico City Hub)',
    description: 'Focused on the vital rail corridors and classification facilities of the Valley of Mexico, including the Ferrovalle yards and Pantaco terminal.',
    context: 'It maps the convergence of Mexican graffiti writers with international rolling stock arriving from the US border, showcasing cross-border artistic dissemination.'
  },
  ferromex: {
    categoryLabel: 'Railroad Carrier Infrastructure',
    description: 'Ferromex (Ferrocarril Mexicano) is Mexico\'s largest freight rail network, operating thousands of boxcars, hoppers, and intermodal flats that serve as an expansive canvas for artists across North America.',
    context: 'Network analysis demonstrates how painted freight units traverse thousands of miles, linking industrial hubs in Mexico with border gateways and US rail interchanges.'
  },
  ferromexgraffiti: {
    categoryLabel: 'Transnational Subculture',
    description: 'Community dedicated specifically to tracking and documenting graffiti applied directly to Ferromex rolling stock.',
    context: 'Highlights constant stylistic dialogue between Mexican and American writers as railcars cycle continuously across international ports of entry.'
  },
  fitness: {
    categoryLabel: 'Semantic Disambiguation Benchmark',
    description: 'A control dataset used for polysemy resolution and noise filtering. In unfiltered social discovery graphs, lifestyle and fitness hashtags spuriously intersect with broader recommendation networks.',
    context: 'Natural Language Processing (NLP) and Named Entity Recognition (NER) isolate these irrelevant clusters, safeguarding the purity of the rail archive.'
  },
  fr8: {
    categoryLabel: 'Railroad Jargon & Vernacular',
    description: 'Classic phonetic shorthand for "freight", originated in railroad worker slang, hobo monikers, and train graffiti tradition throughout the 20th century.',
    context: 'Encapsulates the clandestine identity of painting moving steel across remote classification yards rather than static urban walls.'
  },
  fr8heaven: {
    categoryLabel: 'Staging Yard Hotspot',
    description: 'Subcultural slang describing yards, sidings, or industrial spurs that hold exceptional concentrations of freshly painted or historically preserved boxcars.',
    context: 'Identifies key transit nodes where photographers archive preserved legacy pieces before cars undergo industrial repainting or re-stenciling.'
  },
  fr8porn: {
    categoryLabel: 'Aesthetic & Visual Curation',
    description: 'Digital community vernacular celebrating the aesthetic interplay between heavy industrial steel, rust patinas, and aerosol typography on freight equipment.',
    context: 'Reflects curated photography focusing on natural lighting, weathered backgrounds, and the formal composition of rolling art.'
  },
  freightgraffiti: {
    categoryLabel: 'Core Movement Node',
    description: 'The core umbrella network anchoring the global freight train graffiti movement across North America.',
    context: 'Bridges historic hobo chalk monikers (streaks) with modern aerosol typography across more than 140,000 miles of active rail tracks.'
  },
  freightgraffti: {
    categoryLabel: 'Organic Search Variant',
    description: 'A high-frequency orthographic typo variant observed in organic Instagram metadata tagging.',
    context: 'Illustrates the ability of NLP models to harmonize folksonomic variations, preventing data loss across decentralized social queries.'
  },
  graffitibombing: {
    categoryLabel: 'High-Speed Action Technique',
    description: 'A high-velocity, high-risk execution style (tags, throw-ups, and fast fills) implemented in classification tracks and active sidings.',
    context: 'Captures the rawest dimension of the subculture, prioritizing extreme visibility and tag saturation in time-restricted environments.'
  },
  hashtag: {
    categoryLabel: 'Methodological Discovery Node',
    description: 'An algorithmic exploration root measuring the propagation topology and recommendation pathways of Instagram\'s tagging system.',
    context: 'Provides an empirical baseline to quantify graph modularity and verify the clustering accuracy of identified writer communities.'
  },
  kosm: {
    categoryLabel: 'Polysemy Case Study',
    description: 'A benchmark study in semantic polysemy focused on the writer Kosm, whose moniker overlaps with commercial cosmetic products and spiritual content.',
    context: 'Named Entity Recognition (NER) cleanly filters external contextual noise to isolate authentic freight train graffiti interventions from homonymous clutter.'
  },
  mecro: {
    categoryLabel: 'Iconic Writer (CDC / KSG)',
    description: 'Mecro (CDC, KSG) is universally regarded as one of the most prolific and technically revered figures in modern freight train graffiti history.',
    context: 'Renowned for razor-sharp mechanical bevels, flawless fades, and iconic monikers, his pieces navigate transcontinental routes across BNSF, CSX, and Union Pacific networks.'
  },
  nearaxs: {
    categoryLabel: 'Graffiti Writer (Rolling Stock)',
    description: 'Active North American freight graffiti writer recognized for consistent pieces on long-haul boxcars.',
    context: 'Network co-occurrences demonstrate connectivity with midwestern freight crews and transcontinental rail artists.'
  },
  nogalesbench: {
    categoryLabel: 'Border Transit Hotspot',
    description: 'A strategic observation point at the Nogales international rail gateway (Sonora / Arizona), linking Ferromex and Union Pacific systems.',
    context: 'Provides an indispensable vantage point for documenting the uninterrupted bilateral exchange of painted rolling stock between Mexico and the United States.'
  },
  nogalesbenching: {
    categoryLabel: 'Border Observation Practice',
    description: 'The active photographic tracking of rolling stock at the high-volume Nogales rail bottleneck.',
    context: 'Provides empirical insight into piece longevity, border customs inspection wear, and transcontinental transit times.'
  },
  portlandbench: {
    categoryLabel: 'Pacific Northwest (PNW) Hotspot',
    description: 'An iconic Pacific Northwest benching node in Portland, Oregon, monitoring high-density BNSF and Union Pacific mainlines.',
    context: 'Captures the aesthetic signature of West Coast artists and the distinct atmospheric weathering of the PNW rail environment.'
  },
  sitrek: {
    categoryLabel: 'Graffiti Writer (Rolling Stock)',
    description: 'Sitrek is a prominent contemporary writer in the freight graffiti circuit, widely recognized across boxcars, grain hoppers, and intermodal wells.',
    context: 'Cluster analysis highlights strong co-occurrence with crews operating across cross-border freight routes connecting Mexican and US rail networks.'
  }
};

/**
 * Generates an informative, domain-rich editorial introduction tailored for Googlebot and human readers.
 */
export function generateTaskIntroduction(params: TaskIntroParams): GeneratedIntroduction {
  const seedLower = (params.seedNode || '').toLowerCase().trim();
  const profile = SEED_PROFILES[seedLower];

  const topWritersList = params.writers.map(w => w.term);
  const topCrewsList = params.crews.map(c => c.term);
  const allEntities = [...topWritersList, ...topCrewsList];
  const entitiesSummary = allEntities.join(', ');

  const categoryLabel = profile ? profile.categoryLabel : 'Rail Network Analysis';
  const baseDesc = profile
    ? profile.description
    : `Semantic network and data mining analysis centered around the seed discovery query "${params.seedNode}", situated within the freight train graffiti subculture.`;
  
  const baseContext = profile
    ? profile.context
    : `This dataset examines co-occurrence patterns between media posts, writers, and tags across North American freight rolling stock.`;

  // Construct entities sentence
  let entitiesSentence = '';
  if (topWritersList.length > 0 && topCrewsList.length > 0) {
    entitiesSentence = `Natural Language Processing (NLP) identifies recurring writers including **${topWritersList.slice(0, 3).join(', ')}** alongside prominent rail crews such as **${topCrewsList.slice(0, 3).join(', ')}**.`;
  } else if (topWritersList.length > 0) {
    entitiesSentence = `Named Entity Recognition (NER) highlights frequent appearances of notable writers, notably **${topWritersList.slice(0, 4).join(', ')}**.`;
  } else if (topCrewsList.length > 0) {
    entitiesSentence = `Network structural analysis uncovers close associations with influential graffiti crews such as **${topCrewsList.slice(0, 4).join(', ')}**.`;
  } else {
    entitiesSentence = `The cluster analyzes topological distribution and tag dispersion across freight car classifications.`;
  }

  // Construct post volume and metrics sentence
  const postMetrics = params.postCount
    ? ` This cluster incorporates **${params.postCount.toLocaleString()} cataloged social posts** (MUID: \`${params.muid}\`), disambiguated from extraneous lexical noise to preserve genuine freight rail archival records.`
    : ` This dataset (MUID: \`${params.muid}\`) has been structured to deliver clean semantic indexing for search engines.`;

  const editorialParagraph = `${baseDesc} ${baseContext} ${entitiesSentence}${postMetrics}`;

  const metaDescription = `${baseDesc.slice(0, 110)}... Detected entities: ${entitiesSummary || params.seedNode}. Semantic graph dataset MUID ${params.muid}.`.slice(0, 160);

  const pageTitle = `${params.seedNode} (${params.muid}) — Freight Train Graffiti Network Analysis`;

  const jsonLdDescription = `${baseDesc} ${entitiesSummary ? `Top detected entities: ${entitiesSummary}.` : ''} MUID dataset: ${params.muid}.`.trim();

  return {
    pageTitle,
    metaDescription,
    editorialParagraph,
    jsonLdDescription,
    categoryLabel,
    entitiesSummary
  };
}

import { TextbookChunk } from './textbookTypes';

export const CLASS_10_PHYSICS_CHUNKS: TextbookChunk[] = [
  // =========================================================================
  // CHAPTER 10: LIGHT – REFLECTION AND REFRACTION
  // =========================================================================
  {
    id: 'ncert-c10-ch10-s1',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 10,
    chapterTitle: 'Light – Reflection and Refraction',
    sectionNumber: '10.1',
    sectionTitle: 'Reflection of Light & Laws of Reflection',
    pageNumber: 160,
    content: `Light is a form of electromagnetic radiation that produces the sensation of sight in our eyes. A highly polished surface, such as a mirror, reflects most of the light falling on it. 
Laws of Reflection:
1. The angle of incidence is equal to the angle of reflection: ∠i = ∠r.
2. The incident ray, the normal to the mirror at the point of incidence, and the reflected ray, all lie in the same plane.
These laws of reflection are applicable to all types of reflecting surfaces including spherical surfaces. The image formed by a plane mirror is always virtual and erect, of the same size as the object, situated at the same distance behind the mirror as the object is in front of it, and is laterally inverted.`,
    formulas: ['∠i = ∠r  (Law of Reflection)'],
    keyTerms: ['Reflection', 'Angle of Incidence', 'Angle of Reflection', 'Normal', 'Virtual Image', 'Lateral Inversion'],
    ncertQuestions: [
      {
        question: 'State the laws of reflection of light.',
        answer: '1. The angle of incidence equals the angle of reflection (∠i = ∠r). 2. The incident ray, normal, and reflected ray at the point of incidence all lie in the same plane.'
      }
    ],
    summary: 'Reflection redirects light according to ∠i = ∠r. Plane mirrors form virtual, erect, equal-sized, laterally inverted images.'
  },
  {
    id: 'ncert-c10-ch10-s2',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 10,
    chapterTitle: 'Light – Reflection and Refraction',
    sectionNumber: '10.2',
    sectionTitle: 'Spherical Mirrors: Concave & Convex Mirrors',
    pageNumber: 161,
    content: `A spherical mirror whose reflecting surface is curved inwards, that is, faces towards the centre of the sphere, is called a concave mirror. A spherical mirror whose reflecting surface is curved outwards is called a convex mirror.
Key Definitions:
- Pole (P): The centre of the reflecting surface of a spherical mirror.
- Centre of Curvature (C): The centre of the sphere of which the mirror forms a part.
- Radius of Curvature (R): The radius of the sphere of which the reflecting surface forms a part.
- Principal Axis: The straight line passing through the pole and centre of curvature.
- Principal Focus (F): Rays parallel to the principal axis after reflection converge to (concave mirror) or appear to diverge from (convex mirror) a point on the principal axis called the principal focus.
- Focal Length (f): The distance between the pole and the principal focus. For spherical mirrors of small apertures, the radius of curvature is found to be equal to twice the focal length: R = 2f (or f = R / 2).`,
    formulas: [
      'f = R / 2  (Focal Length & Radius of Curvature)',
      'R = 2 · f'
    ],
    keyTerms: ['Concave Mirror', 'Convex Mirror', 'Pole', 'Centre of Curvature', 'Principal Axis', 'Principal Focus', 'Focal Length'],
    ncertQuestions: [
      {
        question: 'The radius of curvature of a spherical mirror is 20 cm. What is its focal length?',
        answer: 'Focal length f = R / 2 = 20 cm / 2 = 10 cm.'
      },
      {
        question: 'Name a mirror that can give an erect and enlarged image of an object.',
        answer: 'A concave mirror (when the object is placed between its pole P and principal focus F).'
      }
    ],
    summary: 'Concave mirrors converge light; convex mirrors diverge light. Focal length is half of radius of curvature: f = R/2.'
  },
  {
    id: 'ncert-c10-ch10-s3',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 10,
    chapterTitle: 'Light – Reflection and Refraction',
    sectionNumber: '10.2.4',
    sectionTitle: 'Mirror Formula, Sign Convention & Magnification',
    pageNumber: 168,
    content: `New Cartesian Sign Convention for Spherical Mirrors:
1. The object is always placed to the left of the mirror.
2. All distances parallel to the principal axis are measured from the pole (P) of the mirror.
3. Distances measured in the direction of incident light (+x direction) are taken as positive, while distances measured against the direction of incident light (-x direction) are taken as negative. Object distance (u) is always negative.
4. Distances measured perpendicular to and above the principal axis (+y axis) are positive (erect image).
5. Distances measured below the principal axis (-y axis) are negative (inverted image).
- Focal length of concave mirror is always negative (f < 0).
- Focal length of convex mirror is always positive (f > 0).

Mirror Formula:
1/v + 1/u = 1/f
Where u = object distance, v = image distance, and f = focal length.

Magnification (m):
Magnification produced by a spherical mirror gives the relative extent to which the image of an object is magnified:
m = Height of image (h') / Height of object (h) = - v / u
- A negative value of magnification indicates that the image is real and inverted.
- A positive value of magnification indicates that the image is virtual and erect.`,
    formulas: [
      '1/v + 1/u = 1/f  (Mirror Formula)',
      'm = h\' / h = - v / u  (Magnification of Mirror)'
    ],
    keyTerms: ['Mirror Formula', 'New Cartesian Sign Convention', 'Object Distance (u)', 'Image Distance (v)', 'Magnification (m)', 'Real Image', 'Virtual Image'],
    ncertQuestions: [
      {
        question: 'A convex mirror used for rear-view on an automobile has a radius of curvature of 3.00 m. If a bus is located at 5.00 m from this mirror, find the position, nature and size of the image.',
        answer: 'R = +3.00 m => f = +1.50 m. u = -5.00 m. Applying 1/v = 1/f - 1/u = 1/1.50 - 1/(-5.00) = 1/1.50 + 1/5.00 = (5 + 1.5)/(7.5) = 6.5/7.5 => v = +1.15 m. Image is formed at 1.15 m behind the mirror. Magnification m = -v/u = -(+1.15)/(-5.00) = +0.23. The image is virtual, erect, and diminished to 0.23 of original size.'
      }
    ],
    summary: 'Mirror Formula: 1/v + 1/u = 1/f. Magnification: m = -v/u. Concave f is negative; convex f is positive.'
  },
  {
    id: 'ncert-c10-ch10-s4',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 10,
    chapterTitle: 'Light – Reflection and Refraction',
    sectionNumber: '10.3',
    sectionTitle: 'Refraction of Light, Snell\'s Law & Refractive Index',
    pageNumber: 171,
    content: `When light travels obliquely from one transparent optical medium to another, the direction of propagation of light in the second medium changes. This phenomenon is known as refraction of light. It occurs due to the change in the speed of light as it enters a different medium.
When light travels from a rarer medium to a denser medium, it slows down and bends towards the normal. When light travels from a denser medium to a rarer medium, it speeds up and bends away from the normal.

Laws of Refraction of Light:
1. The incident ray, the refracted ray and the normal to the interface of two transparent media at the point of incidence, all lie in the same plane.
2. Snell's Law: The ratio of sine of angle of incidence to the sine of angle of refraction is a constant, for the light of a given colour and for the given pair of media:
sin(i) / sin(r) = constant = n₂₁ = n₂ / n₁

Refractive Index (n):
The refractive index of medium 2 with respect to medium 1 (n₂₁) is the ratio of speed of light in medium 1 (v₁) to the speed of light in medium 2 (v₂):
n₂₁ = v₁ / v₂
Absolute Refractive Index (n) of a medium is given with respect to vacuum/air:
n = c / v
Where c is the speed of light in vacuum (3 × 10⁸ m/s) and v is the speed of light in the medium.
- Diamond has the highest refractive index: n = 2.42, meaning speed of light in diamond is 1/2.42 times that in vacuum.
- Optical density is not the same as mass density. For example, kerosene has a higher refractive index than water (it is optically denser), although its mass density is less than water (it floats on water).`,
    formulas: [
      'sin(i) / sin(r) = constant = n₂₁  (Snell\'s Law)',
      'n₂₁ = v₁ / v₂ = n₂ / n₁  (Relative Refractive Index)',
      'n = c / v  (Absolute Refractive Index, c = 3 × 10⁸ m/s)'
    ],
    keyTerms: ['Refraction', 'Snell\'s Law', 'Optically Rarer', 'Optically Denser', 'Absolute Refractive Index', 'Speed of Light', 'Optical Density'],
    ncertQuestions: [
      {
        question: 'Light enters from air to glass having refractive index 1.50. What is the speed of light in the glass? The speed of light in vacuum is 3 × 10⁸ m/s.',
        answer: 'Refractive index n = c / v => v = c / n = (3 × 10⁸ m/s) / 1.50 = 2 × 10⁸ m/s.'
      },
      {
        question: 'Refractive index of diamond with respect to air is 2.42. What is the meaning of this statement?',
        answer: 'It means that the speed of light in diamond is 1/2.42 of the speed of light in vacuum (c / 2.42 ≈ 1.24 × 10⁸ m/s).'
      }
    ],
    summary: 'Refraction is bending of light due to speed change. Snell\'s Law: sin(i)/sin(r) = n₂/n₁. Absolute refractive index: n = c/v.'
  },
  {
    id: 'ncert-c10-ch10-s5',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 10,
    chapterTitle: 'Light – Reflection and Refraction',
    sectionNumber: '10.4',
    sectionTitle: 'Refraction by Lenses, Lens Formula & Power of a Lens',
    pageNumber: 177,
    content: `A transparent material bound by two surfaces, of which one or both surfaces are spherical, forms a lens.
- Convex Lens (Converging Lens): Thicker at the middle as compared to the edges. It converges light rays falling on it. Focal length of a convex lens is positive (f > 0).
- Concave Lens (Diverging Lens): Thicker at the edges than at the middle. It diverges light rays. Focal length of a concave lens is negative (f < 0).

Lens Formula:
1/v - 1/u = 1/f
(Notice the negative sign before 1/u, contrasting with the mirror formula 1/v + 1/u = 1/f).

Magnification (m) produced by a Lens:
m = Height of image (h') / Height of object (h) = + v / u

Power of a Lens (P):
The degree of convergence or divergence of light rays achieved by a lens is expressed in terms of its power. The power of a lens is defined as the reciprocal of its focal length in meters:
P = 1 / f (in meters)
- The SI unit of power of a lens is Dioptre (D). 1 Dioptre is the power of a lens of focal length 1 metre (1 D = 1 m⁻¹).
- Power of a convex lens is positive (+).
- Power of a concave lens is negative (-).
- When multiple thin lenses are placed in contact, the net power is the algebraic sum of individual powers: P = P₁ + P₂ + P₃...`,
    formulas: [
      '1/v - 1/u = 1/f  (Lens Formula)',
      'm = h\' / h = + v / u  (Magnification of Lens)',
      'P = 1 / f(in meters)  (Power of Lens, in Dioptres D)',
      'P_net = P₁ + P₂ + P₃  (Combination of Lenses in Contact)'
    ],
    keyTerms: ['Convex Lens', 'Concave Lens', 'Lens Formula', 'Magnification of Lens', 'Power of a Lens', 'Dioptre (D)', 'Combination of Lenses'],
    ncertQuestions: [
      {
        question: 'A concave lens has focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens? Also, find the magnification.',
        answer: 'Concave lens: f = -15 cm, v = -10 cm (virtual image formed on same side). 1/v - 1/u = 1/f => 1/u = 1/v - 1/f = 1/(-10) - 1/(-15) = -1/10 + 1/15 = (-3 + 2)/30 = -1/30. Therefore, object distance u = -30 cm. Magnification m = v / u = (-10 cm) / (-30 cm) = +1/3 = +0.33. Image is virtual, erect, and one-third the size of the object.'
      },
      {
        question: 'Find the focal length of a lens of power -2.0 D. What type of lens is this?',
        answer: 'P = 1 / f => f = 1 / P = 1 / (-2.0 D) = -0.5 m = -50 cm. Since focal length and power are negative, it is a concave (diverging) lens.'
      }
    ],
    summary: 'Lens Formula: 1/v - 1/u = 1/f. Magnification: m = v/u. Power P = 1/f(m) in Dioptres (D). Convex lens has +P; concave has -P.'
  },

  // =========================================================================
  // CHAPTER 11: THE HUMAN EYE AND THE COLOURFUL WORLD
  // =========================================================================
  {
    id: 'ncert-c10-ch11-s1',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 11,
    chapterTitle: 'The Human Eye and the Colourful World',
    sectionNumber: '11.1',
    sectionTitle: 'Structure of the Eye & Defects of Vision',
    pageNumber: 187,
    content: `The human eye is one of the most valuable and sensitive sense organs. It functions like a natural camera.
Key Components:
- Cornea: Front transparent bulging membrane where most refraction occurs.
- Iris & Pupil: Iris regulates the size of the pupil. Pupil controls and regulates the amount of light entering the eye.
- Eye Lens: A crystalline convex fibrous jelly-like lens that provides fine adjustment of focal length.
- Ciliary Muscles: Modify the curvature and focal length of the eye lens.
- Retina: Light-sensitive screen at the back of the eye containing rods (intensity) and cones (colour).
- Power of Accommodation: The ability of the eye lens to adjust its focal length. The least distance of distinct vision (near point) for a normal young adult is 25 cm. The far point is infinity.

Major Defects of Vision:
1. Myopia (Near-sightedness): The person can see nearby objects clearly but cannot see distant objects distinctly. The image of distant objects is formed in FRONT of the retina.
   Causes: Excessive curvature of the eye lens or elongation of the eyeball.
   Correction: Corrected using a CONCAVE (diverging) lens of suitable focal length/power.
2. Hypermetropia (Far-sightedness): The person can see distant objects clearly but cannot see nearby objects distinctly. The image of nearby objects is formed BEHIND the retina.
   Causes: Focal length of eye lens is too long or eyeball has become too small.
   Correction: Corrected using a CONVEX (converging) lens.
3. Presbyopia (Old-age hypermetropia): The power of accommodation of the eye decreases with aging due to weakening of ciliary muscles and diminishing flexibility of the eye lens. Corrected using bifocal lenses (upper part concave for distant vision, lower part convex for reading).`,
    formulas: [
      'Near Point of Normal Eye = 25 cm',
      'Far Point of Normal Eye = Infinity (∞)',
      'Myopia Correction = Concave Lens (Negative Power)',
      'Hypermetropia Correction = Convex Lens (Positive Power)'
    ],
    keyTerms: ['Cornea', 'Iris', 'Pupil', 'Retina', 'Power of Accommodation', 'Myopia', 'Hypermetropia', 'Presbyopia', 'Concave Lens Correction', 'Convex Lens Correction'],
    ncertQuestions: [
      {
        question: 'What is the far point and near point of the human eye with normal vision?',
        answer: 'Near point is 25 cm. Far point is infinity (∞).'
      },
      {
        question: 'A student has difficulty reading the blackboard while sitting in the last row. What could be the defect the child is suffering from? How can it be corrected?',
        answer: 'The student suffers from Myopia (near-sightedness). It can be corrected using spectacles fitted with a concave lens of suitable power.'
      }
    ],
    summary: 'Eye near point is 25 cm, far point infinity. Myopia (image in front of retina) is corrected by concave lens; Hypermetropia (image behind retina) by convex lens.'
  },
  {
    id: 'ncert-c10-ch11-s2',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 11,
    chapterTitle: 'The Human Eye and the Colourful World',
    sectionNumber: '11.3 & 11.5',
    sectionTitle: 'Dispersion, Atmospheric Refraction & Scattering of Light',
    pageNumber: 192,
    content: `Dispersion of White Light by a Glass Prism:
When a beam of white light passes through a triangular glass prism, it splits into its seven constituent spectral colours: Violet, Indigo, Blue, Green, Yellow, Orange, Red (VIBGYOR). This phenomenon is called dispersion of light.
- Red light bends the least because it has the longest wavelength and highest speed in glass.
- Violet light bends the most because it has the shortest wavelength and lowest speed in glass.
- Rainbow Formation: A natural spectrum produced by dispersion of sunlight by tiny water droplets acting as miniature prisms. It involves three processes: Refraction, Dispersion, and Internal Reflection.

Atmospheric Refraction:
Refraction of light caused by the Earth's atmosphere having air layers of varying optical densities and temperatures.
Key Phenomena:
1. Twinkling of Stars: Starlight passes through turbulent atmospheric layers of continuously fluctuating temperature and density. The apparent position and intensity of starlight fluctuate rapidly, causing twinkling. Planets do not twinkle because they are much closer and act as extended sources of light.
2. Advance Sunrise and Delayed Sunset: The Sun is visible to us about 2 minutes before the actual sunrise and 2 minutes after actual sunset due to atmospheric refraction bending sunlight over the horizon.

Scattering of Light & Tyndall Effect:
The phenomenon of spreading of light in all directions by colloidal particles or atmospheric gas molecules.
- Rayleigh's Law: The intensity of scattered light is inversely proportional to the fourth power of wavelength: I ∝ 1 / λ⁴.
1. Why is the clear sky blue? Atmospheric nitrogen and oxygen molecules have sizes smaller than the wavelength of visible light. They scatter shorter wavelength blue light much more strongly (about 10 times more) than red light.
2. Why does the Sun appear red at sunrise and sunset? Light travels through a much thicker layer of atmosphere. Most of the shorter blue and violet wavelengths are scattered away, and only the longer red wavelengths reach our eyes.
3. Why are danger signals red? Red light has the longest visible wavelength and is scattered least by fog or smoke, remaining visible from the greatest distance.`,
    formulas: [
      'I ∝ 1 / λ⁴  (Rayleigh Scattering Law)',
      'Deviation: δ_violet > δ_red  (Wavelength λ_red > λ_violet)',
      'VIBGYOR = Violet, Indigo, Blue, Green, Yellow, Orange, Red'
    ],
    keyTerms: ['Dispersion', 'Spectrum', 'VIBGYOR', 'Atmospheric Refraction', 'Twinkling of Stars', 'Advance Sunrise', 'Scattering of Light', 'Tyndall Effect', 'Rayleigh Scattering'],
    ncertQuestions: [
      {
        question: 'Why does the sky appear dark instead of blue to an astronaut in space?',
        answer: 'In outer space, there is no atmosphere to scatter sunlight. With no scattered light reaching the astronaut\'s eyes, the sky appears completely dark.'
      },
      {
        question: 'Why do stars twinkle, but planets do not?',
        answer: 'Stars are point sources of light situated immense distances away, so continuous atmospheric density shifts cause their ray paths and apparent brightness to flicker. Planets are much closer and act as extended sources composed of countless point sources; fluctuations from different points cancel each other out, giving a steady brightness.'
      }
    ],
    summary: 'Dispersion splits white light into VIBGYOR (red bends least, violet most). Atmospheric refraction causes star twinkling and 2-min advance sunrise. Rayleigh scattering (I ∝ 1/λ⁴) makes sky blue and sunset red.'
  },

  // =========================================================================
  // CHAPTER 12: ELECTRICITY
  // =========================================================================
  {
    id: 'ncert-c10-ch12-s1',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 12,
    chapterTitle: 'Electricity',
    sectionNumber: '12.1 - 12.4',
    sectionTitle: 'Electric Current, Potential Difference & Ohm\'s Law',
    pageNumber: 199,
    content: `Electric Current (I):
Electric current is expressed by the amount of electric charge flowing through a particular area of cross-section per unit time:
I = Q / t
Where Q is electric charge (in Coulombs, C) and t is time (in seconds, s).
- The SI unit of electric charge is Coulomb (C). One electron possesses a negative charge of 1.6 × 10⁻¹⁹ C. 1 Coulomb contains approximately 6.25 × 10¹⁸ electrons.
- The SI unit of electric current is Ampere (A), named after André-Marie Ampère. 1 A = 1 C / 1 s.
- Current is measured using an instrument called an Ammeter, which is always connected in series in a circuit and has very low resistance.

Electric Potential Difference (V):
The electric potential difference between two points in an electric circuit is the work done in moving a unit positive charge from one point to the other:
V = W / Q
Where W is work done (in Joules, J) and Q is charge (in Coulombs, C).
- The SI unit of potential difference is Volt (V), named after Alessandro Volta. 1 Volt = 1 Joule / 1 Coulomb (1 V = 1 J/C).
- Potential difference is measured by a Voltmeter, connected in parallel across the two points and having high resistance.

Ohm's Law:
Formulated by Georg Simon Ohm in 1827. It states that the electric current flowing through a metallic conductor is directly proportional to the potential difference applied across its ends, provided its temperature and other physical conditions remain constant:
V ∝ I  =>  V = I · R
Where R is a constant for the given conductor called its Resistance.
- Resistance (R) is the property of a conductor to resist the flow of charges through it: R = V / I.
- SI unit of resistance is Ohm (Ω). 1 Ohm = 1 Volt / 1 Ampere (1 Ω = 1 V/A).
- A straight-line passing through origin on a V-I graph confirms Ohm's law; the slope of the V-I curve gives the resistance R.`,
    formulas: [
      'I = Q / t  (Electric Current in Amperes)',
      'Q = n · e  (Quantization of Charge, e = 1.6 × 10⁻¹⁹ C)',
      'V = W / Q  (Electric Potential Difference in Volts)',
      'V = I · R  (Ohm\'s Law)',
      'R = V / I  (Electrical Resistance in Ohms Ω)'
    ],
    keyTerms: ['Electric Current', 'Ampere', 'Coulomb', 'Ammeter', 'Electric Potential Difference', 'Volt', 'Voltmeter', 'Ohm\'s Law', 'Resistance (Ω)'],
    ncertQuestions: [
      {
        question: 'Calculate the number of electrons constituting one coulomb of charge.',
        answer: 'Q = n · e => n = Q / e = 1 C / (1.6 × 10⁻¹⁹ C) = 6.25 × 10¹⁸ electrons.'
      },
      {
        question: 'How much work is done in moving a charge of 2 C across two points having a potential difference 12 V?',
        answer: 'V = W / Q => W = V × Q = 12 V × 2 C = 24 Joules.'
      }
    ],
    summary: 'Current I = Q/t (Ammeter in series). Potential V = W/Q (Voltmeter in parallel). Ohm\'s Law V = IR defines resistance R = V/I (Ω).'
  },
  {
    id: 'ncert-c10-ch12-s2',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 12,
    chapterTitle: 'Electricity',
    sectionNumber: '12.5',
    sectionTitle: 'Factors Affecting Resistance & Electrical Resistivity',
    pageNumber: 206,
    content: `The electrical resistance of a uniform metallic conductor depends on:
1. Length of the conductor (L): Resistance is directly proportional to its length: R ∝ L.
2. Cross-sectional area of the conductor (A): Resistance is inversely proportional to its area of cross-section: R ∝ 1 / A.
3. Nature of the material: Different materials possess different intrinsic electron collision frequencies.
4. Temperature: For pure metallic conductors, resistance increases with temperature.

Combining these proportionalities yields the Resistivity Equation:
R = ρ · (L / A)
Where ρ (rho) is a constant of proportionality known as the Electrical Resistivity of the material.
- The SI unit of electrical resistivity is Ohm-meter (Ω·m).
- Resistivity is an intrinsic property of the material; it depends on the nature of the material and temperature, but DOES NOT depend on the length or thickness of the wire.
- Metals and alloys have very low resistivity (10⁻⁸ to 10⁻⁶ Ω·m), making them excellent conductors.
- Insulators like rubber and glass have extremely high resistivity (10¹² to 10¹⁷ Ω·m).
- Alloys like Nichrome (Ni, Cr, Mn, Fe) have much higher resistivity than pure metals and do not oxidize (burn) readily at high temperatures. Hence, they are universally used in heating elements of electric irons, toasters, and heaters.
- Tungsten is used almost exclusively for filaments of incandescent electric lamps because of its extremely high melting point (3380 °C) and high resistance.`,
    formulas: [
      'R = ρ · (L / A)  (Resistance Formula)',
      'ρ = R · A / L  (Resistivity in Ω·m)',
      'A = π · r² = π · (d/2)²  (Cross-Sectional Area of Cylindrical Wire)'
    ],
    keyTerms: ['Resistance', 'Length', 'Cross-sectional Area', 'Electrical Resistivity (ρ)', 'Ohm-meter', 'Nichrome Alloy', 'Tungsten Filament'],
    ncertQuestions: [
      {
        question: 'A 4 Ω resistance wire is doubled on itself. Calculate the new resistance of the wire.',
        answer: 'When a wire is folded/doubled on itself, its length halves (L\' = L/2) and its cross-sectional area doubles (A\' = 2A). R\' = ρ · (L\' / A\') = ρ · ((L/2) / (2A)) = (1/4) · (ρ · L / A) = R / 4 = 4 Ω / 4 = 1 Ω. The new resistance is 1 Ω.'
      },
      {
        question: 'Why are coils of electric toasters and electric irons made of an alloy rather than a pure metal?',
        answer: 'Alloys have higher electrical resistivity than pure metals and do not oxidize (burn) easily at high temperatures.'
      }
    ],
    summary: 'R = ρ(L/A). Resistance depends on length and area; resistivity ρ (Ω·m) depends only on material and temperature. Nichrome is used in heating coils.'
  },
  {
    id: 'ncert-c10-ch12-s3',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 12,
    chapterTitle: 'Electricity',
    sectionNumber: '12.6',
    sectionTitle: 'Combination of Resistors: Series and Parallel Circuits',
    pageNumber: 210,
    content: `Resistors in Series:
When two or more resistors are joined end-to-end, they are said to be connected in series.
Characteristics:
1. The electric current (I) flowing through every resistor in the series combination is identical.
2. The total potential difference (V) across the combination equals the sum of potential differences across individual resistors: V = V₁ + V₂ + V₃.
Equivalent Resistance Formula in Series:
R_s = R₁ + R₂ + R₃ + ... + R_n
- The equivalent resistance R_s is always GREATER than the largest individual resistance in the combination.
- Major Drawback: If one component fails (or is switched off), the circuit breaks and none of the other components operate.

Resistors in Parallel:
When two or more resistors are connected across the same two common nodes/terminals, they are connected in parallel.
Characteristics:
1. The potential difference (V) across each resistor is identical and equal to the supply voltage.
2. The total current (I) entering the combination divides into separate branches: I = I₁ + I₂ + I₃.
Equivalent Resistance Formula in Parallel:
1 / R_p = 1 / R₁ + 1 / R₂ + 1 / R₃ + ... + 1 / R_n
For two resistors in parallel:
R_p = (R₁ · R₂) / (R₁ + R₂)
- The equivalent resistance R_p is always SMALLER than the smallest individual resistance in the combination.
- Advantages in Domestic Wiring: Each appliance gets full voltage, operates independently with its own switch, and if one appliance breaks, others continue working normally without disruption.`,
    formulas: [
      'R_s = R₁ + R₂ + R₃  (Series Combination)',
      '1 / R_p = 1 / R₁ + 1 / R₂ + 1 / R₃  (Parallel Combination)',
      'R_p = (R₁ · R₂) / (R₁ + R₂)  (Two Resistors in Parallel)'
    ],
    keyTerms: ['Series Circuit', 'Parallel Circuit', 'Equivalent Resistance', 'Current Division', 'Potential Difference Equality', 'Domestic Wiring Advantages'],
    ncertQuestions: [
      {
        question: 'What is the highest and lowest total resistance that can be secured by combinations of four coils of resistance 4 Ω, 8 Ω, 12 Ω, 24 Ω?',
        answer: 'Highest (Series): R_s = 4 + 8 + 12 + 24 = 48 Ω. Lowest (Parallel): 1/R_p = 1/4 + 1/8 + 1/12 + 1/24 = (6 + 3 + 2 + 1)/24 = 12/24 = 1/2 => R_p = 2 Ω.'
      },
      {
        question: 'Why is a parallel arrangement used in domestic electrical circuits rather than a series circuit?',
        answer: '1. Each appliance receives the full rated supply voltage (220 V). 2. Each appliance can be switched on/off independently. 3. If one appliance fails, other appliances remain functional. 4. Total equivalent resistance is minimized, allowing appropriate operating currents.'
      }
    ],
    summary: 'Series: R_s = R₁ + R₂ (same current). Parallel: 1/R_p = 1/R₁ + 1/R₂ (same voltage). Domestic wiring uses parallel circuits.'
  },
  {
    id: 'ncert-c10-ch12-s4',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 12,
    chapterTitle: 'Electricity',
    sectionNumber: '12.7 & 12.8',
    sectionTitle: 'Joule\'s Heating Effect & Electric Power Calculations',
    pageNumber: 216,
    content: `Heating Effect of Electric Current:
When an electric current flows through a purely resistive conductor, electrical energy is continuously dissipated entirely in the form of thermal heat.
Joule's Law of Heating:
The heat (H) produced in a resistor of resistance R carrying a current I for time t is given by:
H = I² · R · t
Derived from: Work W = V · Q = V · (I · t) = (I · R) · (I · t) = I² · R · t
Also written as:
H = V · I · t = (V² / R) · t
Practical Applications:
- Electric iron, toaster, oven, heater, and electric kettle.
- Electric Bulb: Filament is made of tungsten (melting point 3380 °C) enclosed in chemically inactive nitrogen or argon gas to prevent oxidation.
- Electric Fuse: A safety device made of an alloy of lead and tin with a low melting point. When excessive current flows due to short-circuiting or overloading, Joule heat melts the fuse wire, breaking the circuit and safeguarding expensive appliances.

Electric Power (P):
Electric power is the rate at which electrical energy is consumed or dissipated in an electric circuit:
P = W / t = V · I
Using Ohm's law V = IR:
P = I² · R = V² / R
- The SI unit of electric power is Watt (W). 1 Watt is the power consumed by an appliance carrying 1 A current at 1 V: 1 W = 1 V × 1 A.
- Commercial Unit of Electrical Energy: Kilowatt-hour (kWh), commonly known as a "unit".
1 kWh = 1000 Watts × 3600 seconds = 3.6 × 10⁶ Joules (J).`,
    formulas: [
      'H = I² · R · t  (Joule\'s Law of Heating, in Joules)',
      'H = V · I · t = (V² / R) · t',
      'P = V · I = I² · R = V² / R  (Electric Power in Watts)',
      '1 kWh = 3.6 × 10⁶ J  (Commercial Energy Unit)'
    ],
    keyTerms: ['Joule\'s Law of Heating', 'Electric Fuse', 'Tungsten Filament', 'Electric Power', 'Watt', 'Kilowatt-hour (kWh)', 'Commercial Energy Unit'],
    ncertQuestions: [
      {
        question: 'An electric iron consumes energy at a rate of 840 W when heating is at maximum rate and 360 W when at minimum rate. Voltage is 220 V. Find current and resistance in each case.',
        answer: 'At maximum: P = 840 W, V = 220 V => I = P / V = 840/220 = 3.82 A. Resistance R = V / I = 220 / 3.82 = 57.60 Ω. At minimum: P = 360 W => I = 360 / 220 = 1.64 A. Resistance R = 220 / 1.64 = 134.15 Ω.'
      },
      {
        question: 'Why does the cord of an electric heater not glow while the heating element does?',
        answer: 'The cord is made of copper with extremely low resistance, so heat produced (H = I²Rt) is negligible. The heating element is made of nichrome with very high resistance, producing intense heat and glowing red.'
      }
    ],
    summary: 'Joule\'s Heating: H = I²Rt. Power: P = VI = I²R = V²/R (Watts). Commercial unit: 1 kWh = 3.6 × 10⁶ Joules. Fuse wire has low melting point.'
  },

  // =========================================================================
  // CHAPTER 13: MAGNETIC EFFECTS OF ELECTRIC CURRENT
  // =========================================================================
  {
    id: 'ncert-c10-ch13-s1',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 13,
    chapterTitle: 'Magnetic Effects of Electric Current',
    sectionNumber: '13.1 - 13.3',
    sectionTitle: 'Magnetic Field, Field Lines & Solenoid Electromagnetism',
    pageNumber: 224,
    content: `Hans Christian Oersted (1820) discovered that an electric current carrying wire produces a magnetic field around it, deflecting a nearby magnetic compass needle.
Magnetic Field Lines & Properties:
1. Magnetic field lines emerge from the North pole of a magnet and enter the South pole outside the magnet; inside the magnet, they travel from South to North, forming continuous closed loops.
2. The relative strength of the magnetic field is indicated by the degree of closeness of the field lines (crowded lines = stronger field).
3. No two magnetic field lines ever intersect each other. If they did, it would mean that at the point of intersection, the compass needle would point in two different directions at once, which is physically impossible.

Right-Hand Thumb Rule (Maxwell's Rule):
Imagine that you are holding a current-carrying straight conductor in your right hand such that the thumb points towards the direction of current. Then your fingers wrapped around the conductor indicate the direction of the concentric circular magnetic field lines.

Magnetic Field due to a Solenoid:
A coil of many circular turns of insulated copper wire wrapped closely in the shape of a cylinder is called a solenoid.
- The magnetic field lines inside a current-carrying solenoid are parallel straight lines. This indicates that the magnetic field is uniform at all points inside the solenoid.
- Electromagnet: A strong magnetic field produced inside a solenoid can be used to magnetize a piece of magnetic material, like soft iron, placed inside the coil. Such a magnet is called an electromagnet. Soft iron is used because it gains and loses magnetism readily.`,
    formulas: [
      'B ∝ I / r  (Field of Straight Conductor, inversely proportional to distance r)',
      'B_solenoid ∝ n · I  (Field of Solenoid, n = turns per unit length, I = current)'
    ],
    keyTerms: ['Oersted Experiment', 'Magnetic Field Lines', 'Right-Hand Thumb Rule', 'Solenoid', 'Uniform Magnetic Field', 'Electromagnet', 'Soft Iron Core'],
    ncertQuestions: [
      {
        question: 'Why don\'t two magnetic field lines intersect each other?',
        answer: 'If they intersected, at the point of intersection a compass needle would have to point in two different directions simultaneously, which is impossible.'
      },
      {
        question: 'What is the nature of the magnetic field inside a long straight current-carrying solenoid?',
        answer: 'The magnetic field inside a solenoid is uniform and parallel to the axis of the solenoid.'
      }
    ],
    summary: 'Magnetic field lines are closed continuous loops that never intersect. Right-hand thumb rule determines direction. A current-carrying solenoid produces a uniform internal field and forms an electromagnet.'
  },
  {
    id: 'ncert-c10-ch13-s2',
    classLevel: 10,
    subject: 'Physics',
    textbookName: 'NCERT Science Class 10',
    chapterNumber: 13,
    chapterTitle: 'Magnetic Effects of Electric Current',
    sectionNumber: '13.4 - 13.7',
    sectionTitle: 'Fleming\'s Left-Hand Rule, Electric Motor & Domestic Circuits',
    pageNumber: 231,
    content: `Force on a Current-Carrying Conductor in a Magnetic Field:
Andre-Marie Ampere suggested that if a current-carrying conductor produces a magnetic field and exerts a force on a magnet, the magnet must also exert an equal and opposite force on the conductor.
- Force is maximum when the conductor is perpendicular to the magnetic field direction (θ = 90°).
- Force is zero when the conductor is parallel to the magnetic field (θ = 0°).
Lorentz Force: F = B · I · L · sin(θ)

Fleming's Left-Hand Rule (Motor Rule):
Stretch the thumb, forefinger and middle finger of your left hand mutually perpendicular to each other:
- Forefinger points in the direction of the Magnetic Field (B).
- Middle finger points in the direction of Current (I).
- Thumb points in the direction of Motion or Force (F) acting on the conductor.
(Mnemonic: Father = Force/Thumb, Mother = Magnetic Field/Forefinger, Child = Current/Middle finger).

Electric Motor:
A device that converts electrical energy into mechanical energy.
Principle: Based on the mechanical force experienced by a current-carrying rectangular coil placed in a magnetic field.
Key Component: Split-ring commutator reverses the direction of current in the coil every half-rotation, ensuring unidirectional continuous rotation.

Electromagnetic Induction (Michael Faraday, 1831):
The phenomenon of producing an induced electric current in a closed circuit by changing the magnetic flux linked with it.
Fleming's Right-Hand Rule (Generator Rule):
Thumb = Motion of conductor; Forefinger = Magnetic field; Middle finger = Induced Current.

Domestic Electric Circuits:
- Standard supply voltage in India is 220 V, with an alternating frequency of 50 Hz (changes direction every 1/100 second).
- Three Wires:
  1. Live Wire (Phase): Red insulation, high potential (220 V).
  2. Neutral Wire: Black insulation, zero potential (0 V).
  3. Earth Wire: Green insulation, connected to a metal plate buried deep in the ground near the house. It provides a low-resistance path for leakage current, preventing severe electric shocks from appliances with metallic bodies (electric iron, refrigerator).
- Short-Circuiting: Occurs when live and neutral wires come in direct contact due to damaged insulation, causing circuit resistance to drop to near-zero and current to spike dangerously.
- Overloading: Occurs when too many high-power appliances are connected to a single socket simultaneously.`,
    formulas: [
      'F = B · I · L · sin(θ)  (Magnetic Force on Conductor)',
      'AC Frequency in India = 50 Hz (Voltage = 220 V)',
      'Fleming\'s Left Hand: Thumb=Force, Forefinger=Field, Middle=Current'
    ],
    keyTerms: ['Fleming\'s Left-Hand Rule', 'Electric Motor', 'Split-ring Commutator', 'Electromagnetic Induction', 'Fleming\'s Right-Hand Rule', 'Live Wire', 'Neutral Wire', 'Earth Wire', 'Short Circuit', 'Overloading'],
    ncertQuestions: [
      {
        question: 'State Fleming\'s Left-Hand Rule.',
        answer: 'Stretch thumb, forefinger, and middle finger of left hand mutually perpendicular: Forefinger represents Magnetic Field, Middle finger represents Current, and Thumb points in the direction of Force or Motion.'
      },
      {
        question: 'What is the function of an earth wire? Why is it necessary to earth metallic appliances?',
        answer: 'The earth wire provides a safe, low-resistance path to the ground for any leakage current. If live wire touches the metallic body of an appliance, current flows safely to ground without giving an electric shock to the user.'
      }
    ],
    summary: 'Fleming\'s Left-Hand Rule: Thumb=Force, Forefinger=Field, Middle=Current. Electric motor converts electrical to mechanical energy using a split-ring commutator. Earth wire prevents electric shocks.'
  }
];

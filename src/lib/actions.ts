"use server";


import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import {
  patternFormatChecker,
  getRepeatPatternObject,
  getStartEndDate,
} from "./date";

import { signOut } from "next-auth/react";
import { redirect } from 'next/navigation';
import { sanitizeString } from "./sanitize";
import { prisma } from "./prisma";

/* import cloudinary from "cloudinary"
import { recordEvent } from "@/app/lib/tinybird"; */

export const fetchAllData = async () =>
  {
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return null;
  
    const { user } = session;
    return await prisma.challenge.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })
  }

/**
 * Update habit status as checked-in
 * Make habit finished when streak reaches to goal
 **/
export async function checkinChallenge(id: string)
{
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    throw new Error("User not logged in");

  // Get data by id
  let challenge = await prisma.challenge.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!challenge) {
    throw new Error("challenge not found");
  }

  if (
    challenge.repeatPattern.length === 0 ||
    !patternFormatChecker(challenge.repeatPattern)
  )
    throw new Error("challenge repeat type Error");

  // Get pattern object
  let patternObj = getRepeatPatternObject(challenge.repeatPattern);

  // calculate first checkin start/end dates
  const {startDate, endDate, lastLevel, streakIncrease} = getStartEndDate(
    patternObj,
    challenge.lastLevel + 1
  );

  let newStreak = challenge.streak + streakIncrease;
  let newStatus = challenge.status;
  let newLastStreak = challenge.lastStreak;

  // Check if habit is finished by comparing streak with goal
  // if finished (newStatus=2) reset streak=0 and set lastStreak = goal
  if ( newStreak === challenge.goal ) {
    newStatus = 2;
    newStreak = 0;
    newLastStreak = challenge.goal;
  }

  return await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      
      lastLevel,
      
      streak: newStreak,
      lastStreak: newLastStreak,
      status: newStatus,
    },

  }).then( async (res) => {
    // Record event logs
   // await recordEvent('checkin')
    if ( newStatus === 2 ) {
      console.log(challenge);
      //await recordEvent('reach')
    }
    return res
  });
}

/**
 * Disable habits that skipped by checking dates and updating status = 0
 */
export async function updateChallenges(user: CustomerUser) {

  const records = await prisma.challenge.findMany({
    where: {
      userId: user.id,
      status: 1,
      endDate: {
        lt: new Date(),
      },
    },
  });

  records.forEach(async (record) => {
    let bestStreak =
      record.streak > record.lastStreak ? record.streak : record.lastStreak;
    await prisma.challenge.update({
      where: {
        id: record.id,
      },
      data: {
        status: 0,
        lastStreak: bestStreak,
        streak: 0,
        lastLevel: 0,
        startDate: null,
        endDate: null,
        streakBreaks: {
          increment: 1,
        },
      },
    });
  });
}

/**
 * Activate broken habit
 */
export async function activateChallenge(id: string) {

  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    throw new Error("User not logged in");

  // Get data by id
  let challenge = await prisma.challenge.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!challenge) {
    throw new Error("Habit not found");
  }

  if (
    challenge.repeatPattern.length === 0 ||
    !patternFormatChecker(challenge.repeatPattern)
  )
    throw new Error("Habit repeat type Error");

  // Get pattern object
  let patternObj = getRepeatPatternObject(challenge.repeatPattern);

  // calculate first checkin start/end dates
  const {startDate, endDate} = getStartEndDate(patternObj, 0);

  return await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      status: 1,
    },
  });
}

/**
 * Start finished habit again by setting status from 2 to 1
 */
export async function restartChallenge(id: string) {

  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    throw new Error("User not logged in");

  // Get data by id
  let challenge = await prisma.challenge.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!challenge) {
    throw new Error("Habit not found");
  }

  if (
    challenge.repeatPattern.length === 0 ||
    !patternFormatChecker(challenge.repeatPattern)
  )
    throw new Error("Habit repeat type Error");

  // Get pattern object
  let patternObj = getRepeatPatternObject(challenge.repeatPattern);

  // calculate first checkin start/end dates
  const {startDate, endDate} = getStartEndDate(patternObj, 0);

  return await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      endDate,
      status: 1,
    },
  });
}

/**
 * Create new habit
 */
export async function createChallenge(data: FormData) {
	'use server'

	// Get user session token
  const session = await getServerSession(authOptions);
	if (!session || !session.user)
		throw new Error('User not logged in')

	// Get posted data
	let habitName = data.get('habitName')?.valueOf().toString() || ''
	let repeatPattern = data.get('repeatPattern')?.valueOf().toString() || '1d'
	let emoji = data.get('emoji')?.valueOf().toString() || ''
  let goal = parseInt( data.get('habitGoal')?.valueOf().toString() || '' )

	// Sanitize posted data
	habitName = sanitizeString( habitName )
	repeatPattern = sanitizeString( repeatPattern )

	// Validate posted data
	if ( typeof habitName !== 'string' || habitName.length === 0 )
		throw new Error('Habit name Error');
	if ( typeof repeatPattern !== 'string' || repeatPattern.length === 0 || !patternFormatChecker(repeatPattern) )
		throw new Error('Habit repeat type Error');
  if ( goal < 7 || goal > 365 )
    goal = 30

	// Get pattern object
	let patternObj = getRepeatPatternObject(repeatPattern)

	// calculate first checkin start/end dates
	const {startDate, endDate} = getStartEndDate (patternObj, 0)
	
	return await prisma.challenge.create({
		data: {
			name: habitName,
			emoji,
			repeatPattern,
      goal,
			readablePattern: patternObj.readablePattern,
			levels: patternObj.levels,
			startDate,
			endDate,
			userId: session.user.id
		}

	}).then( async (res) => {
    // Record event log
    /* await recordEvent('create') */
    return res
  });
}

/**
 * Update User Profile
 */
export async function updateProfile(data: FormData) {
	'use server'

	// Get user session token
  const session = await getServerSession(authOptions);
	if (!session || !session.user)
		throw new Error('User not logged in')

	// Get posted data
	let name = data.get('name')?.valueOf().toString() || ''
	let timezone = data.get('timezone')?.valueOf().toString() || ''

	// Sanitize posted data
	name = sanitizeString( name )
	timezone = sanitizeString( timezone )

	// Validate posted data
	if ( typeof name !== 'string' || name.length === 0 )
		throw new Error('User Full Name Error');

	return await prisma.user.update({
    where: {
      id: session.user.id
    },
		data: {
			name,
			timezone,
		}
	})
}

/**
 * Update Profile Picture
 */
export async function updateProfilePicture(id: string, image: string) {
  'use server'

  if( !image )
    return '';

	// Get user session token
  const session = await getServerSession(authOptions);
	if (!session || !session.user || session.user.id !== id)
		return '';

  // Upload image to Cloudinary
  const { secure_url } = await cloudinary.v2.uploader.upload(image, {
    folder: 'streakup-Profile',
    overwrite: true,
    invalidate: true,
    transformation: [
      { width: 200, height: 200, gravity: "face", crop: "thumb" }
    ]
  });

  if ( !secure_url )
    return '';

  // Update user profile picture in prisma
  const user = await prisma.user.update({
    where: { id },
    data: { image: secure_url }
  })
  
  return user.image
}


/**
 * Delete All User Data
 */
export async function deleteUser(id: string): Promise<boolean> {
	'use server'

	// Get user session token
  const session = await getServerSession(authOptions);
	if (!session || !session.user || session.user.id !== id)
		throw new Error('User not logged in')

  let res = await prisma.$transaction([
    prisma.challenge.deleteMany({ where: { userId: id } }),
    prisma.account.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } })
  ])

  if ( res ) {
    signOut({ callbackUrl: '/' })
    redirect('/')
  }

  return false
}


/**
 * Delete All User Data
 */
export async function deleteChallenge(id: string): Promise<boolean> {
	'use server'

	// Get user session token
  const session = await getServerSession(authOptions);
	if (!session || !session.user)
		throw new Error('User not logged in')

  let result = await prisma.challenge.delete({
    where: { id }
  })

  if( !result ) return false

  return true
}

/**
 * Update habit Name
 */
export async function updateChallengeName(id: string, name: string) {
  'use server'

  // Get user session token
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    throw new Error('User not logged in')

  return await prisma.challenge.update({
    where: { id },
    data: {
      name
    }
  })
}
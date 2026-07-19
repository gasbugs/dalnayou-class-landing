# Operating Plan

## Objective

Make campaign changes repeatable from request to verified live deployment while preserving user work and keeping mutable facts consistent across web, print, social, and operator-message surfaces.

## Loop

1. Intake: parse the outcome and whether it is live, preview-only, or advisory; extract exact old/new facts.
2. Discovery: inspect git status, search exact phrases with `rg`, and map occurrences to public and derived surfaces.
3. Impact decision: distinguish a narrow wording change from a shared campaign fact, visual change, or tracking change.
4. Implementation: patch existing files, preserve analytics attributes, and regenerate only required derived assets.
5. Static verification: run the bundled audit, `git diff --check`, and focused diffs.
6. Visual verification: inspect actual mobile, desktop, A4, or social-card dimensions.
7. Publication: stage scoped files, commit, push, and verify the live distinguishing text.
8. Measurement: confirm event names and UTM identity; distinguish clicks from completed applications.
9. Feedback: link directly to the changed surface and apply corrections through the same loop.

## Mutable fact checklist

Whenever one of these changes, search every current public surface:

- Course names and ordering
- Audience and minimum age
- Start date and all session dates
- Morning and afternoon times
- Course duration and total hours
- Venue, route, and parking wording
- Regular and promotional prices
- Discount amount and percentage
- Deadline and scarcity language
- Instructor names and histories
- Preparation requirements and resource links
- Account, form, map, Kakao, refund, and Notion URLs
- UTM campaign identifiers

## Definition of done

A live change is done only when:

- The requested wording or behavior exists in the correct source.
- Related facts are not contradictory on current public surfaces.
- Tracking attributes and destination parameters remain intact.
- Static checks pass or pre-existing warnings are identified.
- Relevant visual dimensions were checked, or the limitation is disclosed.
- Only scoped files were committed.
- The public URL serves the new distinguishing content.
- The user receives the direct verification link.

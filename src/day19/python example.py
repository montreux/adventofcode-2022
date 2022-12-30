import fileinput
import re

# Adapted from code by Boojum
# Github: https://topaz.github.io/paste/#XQAAAQBbBgAAAAAAAAA0m0pnuFI8c9WAoVc3IiG2klervCAxeT2BgGKyD1MWpAnQBJqyCSMRI+beWWpduYnykvqnNoUuksfnFmLCeXGuEImHGEMmlF0aCsp7Q90Fsoe/SueNlGc5JUDFgaQ4QFpF3TK9+uV5t8F/oOTtbCv7N5nShLckuP9tmIHyyeQdXCjSCOQqQpxb+oK1qpSU9Yu8o3BECc0KIAYVhQIrPHyck+2Qf8g9qKTFHGGYh3LmqGnAHzseBwo/T8Ui6UxLfvW5BzRll+RFyj8sGJJ5qVF1bjsR8JfIgXYRrUIA+jw3n6ZyGHQAZqrJ8+SiTUNvr53JsbQkKlGdMkA0L5LWfzFIjKVaPhwlLZW2ulsrE9Uf5bS/2xNpoWfBtqPSdUJ8pcMG+A/RZ2/eB90wU2CpOJMehKLZLHumgNN3o3EWpTHwa8YnJPQfwue47LJjJSW82wfwfKJQomHe9sAB8wwizN8Kc7TcaEpT2m57n/5UM/rz3tHUa0zYQx6XcB4cyG8ZaLL+UgesiNYH57cCS4z81dwIsKmLoE/WG/gzK+gxOG0KKa2YrIHmu4qmdAvgvnYmNdRgFNMa1dU26rU0tvP9w8KocJW2KnJuoM5HRiUfXfHQm2Ya3HvSj7TiUkARq5lsflStfsGxi8SjJC1eZI/b4E7v0EoxxVzPYRCVAprtpMLB/16CvHbCx4Rn3HtWkYHQ0fUIdDYWnVx/mjEVixzOY+nU//sF/Jg=
# Reddit: https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tls7a/?utm_source=share&utm_medium=web2x&context=3

pathToPuzzleInput = "/Users/johnholcroft/Repositories/adventofcode-2022/src/day19/notEnoughMinerals.puzzledata.txt"

ORE, CLAY, OBSIDIAN, GEODE = range(4)
qualityLevel = 0
maxExtraGeodesWithRemainingTime = [(t - 1) * t // 2 for t in range(24 + 1)]
blueprintParameters = [list(map(int, re.findall("-?\d+", inputLine)))
                       for inputLine in fileinput.input(pathToPuzzleInput)]
for blueprintNumber, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, obsidianRobotClayCost, geodeRobotOreCost, geodeRobotObsidianCost in blueprintParameters:
    bestGeodeCount = 0
    maxOreRobots, maxClayRobots, maxObsidianRobots = max(
        oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, geodeRobotOreCost), obsidianRobotClayCost, geodeRobotObsidianCost

    def dfs(timeRemaining, goalRobotType,         # t:time remaining, g:goal robot type
            # i:ore, j:clay, k:obsidian, l:geode robots
            oreRobotCount, clayRobotCount, obsidianRobotCount, geodeRobotCount,
            oreCount, clayCount, obsidianCount, geodeCount):  # w:ore, x:clay, y:obsidian, z:geode available
        global bestGeodeCount
        if (goalRobotType == ORE and oreRobotCount >= maxOreRobots or
            goalRobotType == CLAY and clayRobotCount >= maxClayRobots or
            goalRobotType == OBSIDIAN and (obsidianRobotCount >= maxObsidianRobots or clayRobotCount == 0) or
            goalRobotType == GEODE and obsidianRobotCount == 0 or
                geodeCount + geodeRobotCount * timeRemaining + maxExtraGeodesWithRemainingTime[timeRemaining] <= bestGeodeCount):
            return
        while timeRemaining:
            if goalRobotType == ORE and oreCount >= oreRobotOreCost:
                for goalRobotType in [ORE, CLAY, OBSIDIAN, GEODE]:
                    dfs(timeRemaining - 1, goalRobotType, oreRobotCount + 1, clayRobotCount, obsidianRobotCount, geodeRobotCount, oreCount -
                        oreRobotOreCost + oreRobotCount, clayCount + clayRobotCount, obsidianCount + obsidianRobotCount, geodeCount + geodeRobotCount)
                return
            elif goalRobotType == CLAY and oreCount >= clayRobotOreCost:
                for goalRobotType in [ORE, CLAY, OBSIDIAN, GEODE]:
                    dfs(timeRemaining - 1, goalRobotType, oreRobotCount, clayRobotCount + 1, obsidianRobotCount, geodeRobotCount, oreCount -
                        clayRobotOreCost + oreRobotCount, clayCount + clayRobotCount, obsidianCount + obsidianRobotCount, geodeCount + geodeRobotCount)
                return
            elif goalRobotType == OBSIDIAN and oreCount >= obsidianRobotOreCost and clayCount >= obsidianRobotClayCost:
                for goalRobotType in [ORE, CLAY, OBSIDIAN, GEODE]:
                    dfs(timeRemaining - 1, goalRobotType, oreRobotCount, clayRobotCount, obsidianRobotCount + 1, geodeRobotCount, oreCount - obsidianRobotOreCost +
                        oreRobotCount, clayCount - obsidianRobotClayCost + clayRobotCount, obsidianCount + obsidianRobotCount, geodeCount + geodeRobotCount)
                return
            elif goalRobotType == GEODE and oreCount >= geodeRobotOreCost and obsidianCount >= geodeRobotObsidianCost:
                for goalRobotType in [ORE, CLAY, OBSIDIAN, GEODE]:
                    dfs(timeRemaining - 1, goalRobotType, oreRobotCount, clayRobotCount, obsidianRobotCount, geodeRobotCount + 1, oreCount - geodeRobotOreCost +
                        oreRobotCount, clayCount + clayRobotCount, obsidianCount - geodeRobotObsidianCost + obsidianRobotCount, geodeCount + geodeRobotCount)
                return
            timeRemaining, oreCount, clayCount, obsidianCount, geodeCount = timeRemaining - 1, oreCount + \
                oreRobotCount, clayCount + clayRobotCount, obsidianCount + \
                obsidianRobotCount, geodeCount + geodeRobotCount
        bestGeodeCount = max(bestGeodeCount, geodeCount)
    for goalRobot in [ORE, CLAY, OBSIDIAN, GEODE]:
        dfs(24, goalRobot, 1, 0, 0, 0, 0, 0, 0, 0)
    qualityLevel += bestGeodeCount * blueprintNumber
print(qualityLevel)
